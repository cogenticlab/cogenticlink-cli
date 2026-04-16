const BASE_URL = 'https://link.cogenticlab.io';

export async function request(endpoint, token, body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
  if (body !== null) {
    options.body = JSON.stringify(body);
  } else {
    options.body = '{}';
  }

  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type');

  let data;
  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else if (contentType?.includes('text/markdown')) {
    data = await response.text();
  } else {
    data = await response.text();
  }

  return { status: response.status, data, isJson: contentType?.includes('application/json') };
}

export async function fetchCategories(token) {
  const { data } = await request('/tool/categories', token, {});
  return data;
}

export async function fetchTools(token, category) {
  const endpoint = category === 'All Tools' ? '/tool/list' : `/tool/list/${encodeURIComponent(category)}`;
  const { data } = await request(endpoint, token, '');
  return data;
}

export async function fetchToolDescription(token, toolName) {
  const endpoint = `/tool/description/${encodeURIComponent(toolName)}`;
  const { data } = await request(endpoint, token, '');
  return data;
}

export async function callTool(token, toolName, params) {
  const endpoint = `/tool/call/${encodeURIComponent(toolName)}`;
  const { data } = await request(endpoint, token, params);
  return data;
}