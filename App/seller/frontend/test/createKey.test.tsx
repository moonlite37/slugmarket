import { describe, it, expect } from 'vitest';
import { render, screen} from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../vitest.setup';
import CreateKey from '@/CreateKey';
import userEvent from '@testing-library/user-event';

function setupMock(status: number, response: string) {
  server.use(
    http.post('http://localhost:3000/seller/api/v0/corp/generate', () => {
      if (status === 200) {
        return new HttpResponse(response, { status: 200 });
      }
      return new HttpResponse(null, { status });
    }),
  );
  render(<CreateKey/>)
}

describe('Generate key', () => {
  it('generates and displays API key', async () => {
    setupMock(200, 'test-api-key-123');
    userEvent.click(screen.getByText('Generate API Key'));
    expect(await screen.findByText('API Key: test-api-key-123')).toBeDefined();
  });

  it('shows error when request fails', async () => {
    setupMock(401, '');
    userEvent.click(screen.getByText('Generate API Key'));
    expect(await screen.findByText('You are not authorized to generate an API key')).toBeDefined();
  });
});