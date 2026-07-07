export default async function handler(event) {
  try {
    const raw = event.queryStringParameters?.keywords ?? '';
    const keywords = raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (!keywords.length) {
      return json(400, { error: 'Provide keywords using ?keywords=term1,term2,term3' });
    }

    const request = {
      comparisonItem: keywords.map((keyword) => ({
        keyword,
        geo: 'WORLD',
        time: 'now 7-d',
      })),
      category: 0,
      property: '',
    };

    const exploreUrl = new URL('https://trends.google.com/trends/api/explore');
    exploreUrl.searchParams.set('hl', 'en-US');
    exploreUrl.searchParams.set('tz', '0');
    exploreUrl.searchParams.set('req', JSON.stringify(request));

    const exploreResponse = await fetch(exploreUrl, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'x-requested-with': 'XMLHttpRequest',
      },
    });

    const exploreText = await exploreResponse.text();
    const exploreJson = parseGoogleJson(exploreText);
    const widget = exploreJson.widgets?.find((entry) => entry.id === 'TIMESERIES');

    if (!widget) {
      return json(502, { error: 'Google Trends did not return a TIMESERIES widget.' });
    }

    const multilineUrl = new URL('https://trends.google.com/trends/api/widgetdata/multiline');
    multilineUrl.searchParams.set('req', JSON.stringify(widget.request));
    multilineUrl.searchParams.set('token', widget.token);
    multilineUrl.searchParams.set('tz', '0');

    const multilineResponse = await fetch(multilineUrl, {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'x-requested-with': 'XMLHttpRequest',
      },
    });

    const multilineText = await multilineResponse.text();
    const multilineJson = parseGoogleJson(multilineText);
    const timelineData = multilineJson.default?.timelineData ?? [];
    const ranked = rankKeywords(keywords, timelineData);

    return json(200, {
      keywords,
      results: ranked.slice(0, 3),
      source: 'Google Trends, past 7 days',
    });
  } catch (error) {
    return json(500, {
      error: 'Trend lookup failed.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}

function parseGoogleJson(text) {
  return JSON.parse(text.replace(/^\)\]\}',?\n/, ''));
}

function rankKeywords(keywords, timelineData) {
  const scores = new Map(keywords.map((keyword) => [keyword, { keyword, total: 0, points: 0 }]));

  for (const point of timelineData) {
    const values = point.value ?? [];
    keywords.forEach((keyword, index) => {
      const score = Number(values[index] ?? 0);
      const entry = scores.get(keyword);
      entry.total += score;
      entry.points += 1;
    });
  }

  return [...scores.values()]
    .map((entry) => ({
      keyword: entry.keyword,
      averageInterest: entry.points ? Math.round((entry.total / entry.points) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.averageInterest - a.averageInterest);
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}
