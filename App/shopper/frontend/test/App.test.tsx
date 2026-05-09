import {expect, it, describe} from "vitest"
import App from '../src/App'
import {render, screen} from '@testing-library/react'

it('Renders', async () => {
    render(<App/>);
})

