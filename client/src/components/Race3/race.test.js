import { screen, render } from '@testing-library/react';
import Game from '.';
import Gamepage from '../../Pages/Gamepage';

import React from 'react'
import '@testing-library/jest-dom'

describe('SceneMain', () =>{

    test('to see if it loads', () => {
        render(<Game />)
        const gameClass = screen.getByRole('race')
        expect(gameClass).toBeInTheDocument();
    });

})
