import { screen, render, fireEvent, act } from '@testing-library/react';
import {BrowserRouter as Router} from 'react-router-dom';
import Header from '.'

describe('Header', () =>{

    beforeEach(() =>{
        render(<Header />, { wrapper: Router } )
    })

    test('Clicking title text sends to homepage', () =>{
        const title = screen.getByRole('heading', { name: 'ChessRacerZ'})

        fireEvent.click(title)

        expect(window.location.pathname).toBe("/")
    })

})