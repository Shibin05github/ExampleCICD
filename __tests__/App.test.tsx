/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/api/ListService', () => ({
  getProducts: jest.fn(() =>
    Promise.resolve({ products: [], total: 0, skip: 0, limit: 10 })
  ),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
    await Promise.resolve();
  });
});
