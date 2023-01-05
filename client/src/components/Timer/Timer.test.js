import { screen, render, fireEvent, act } from '@testing-library/react';
import Timer from '.'

import MockedSocket from 'socket.io-mock';

describe('Timer', () =>{
  let socket = new MockedSocket()

    beforeEach(() =>{
        render(<Timer />)
    })

    afterEach(() => {
      jest.restoreAllMocks();
    });
  

    test('Timer is displayed', () => {
        const timer = screen.getByRole('timer')
        
        expect(timer).toBeInTheDocument()
        expect(screen.getByText("0 : 0")).toBeInTheDocument();
    })

    test('Timer starts and updates when "start-timer" event is received', () => {
      
      function wait(){}

      const setTimer = jest.fn()

      socket.on('start-timer', (time) => {

        // expect(setTimer).toHaveBeenCalled()
        // setTimeout(wait,1000);
        expect(time).toEqual(60)
        // expect(screen.getByText("1 : 0")).toBeInTheDocument();
        // setTimeout(wait,1000);
        // expect(screen.getByText("0 : 59")).toBeInTheDocument();
      })

      socket.socketClient.emit('start-timer', 60)
    });

})