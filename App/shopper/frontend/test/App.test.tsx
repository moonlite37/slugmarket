import {it} from "vitest"
import App from '../src/App'
import {render} from '@testing-library/react'
import { server } from '../vitest.setup';
import { mockListings } from './mocks';

it('Renders', async () => {
    server.use(mockListings());
    render(<App/>);
})

