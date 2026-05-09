import { it, vi } from 'vitest'
import { NextRequest } from 'next/server'

import proxy from '../src/proxy'

it('Allows Public Routes', async () => {
  const req = new NextRequest(new URL('http://localhost:3000/login'))
  await proxy(req)
})

it('Accepts Session Cookie', async () => {
  const req = new NextRequest(new URL('http://localhost:3000'))
  await proxy(req)
})

it('Rejects Missing Session Cookie', async () => {
  vi.doMock('next/headers', async () => {
    return {
      cookies: async () => { return { 
        get: (key: string) => {
          return key == 'session' ? undefined : key
        }}},
    }
  })
  vi.resetModules();
  const proxy = await import('../src/proxy')
  const req = new NextRequest(new URL('http://localhost:3000'))
  await proxy.default(req)
})