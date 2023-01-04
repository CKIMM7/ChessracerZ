import { screen, render, fireEvent, act } from '@testing-library/react';
import Timer from '.'
import { socket } from '../../socket'

// jest.mock("../../socket", () => ({
//     socket: {
//       on: jest.fn()
//     }
// }));


describe('Timer', () =>{

    beforeEach(() =>{
        render(<Timer />)
    })

    test('Timer is displayed', () =>{
        const timer = screen.getByRole('timer')

        expect(timer).toBeInTheDocument()
    })

    test('Timer starts and updates when "start-timer" event is received', () =>{

        act(() => {
          socket.emit("start-timer", 60);
        });
        expect(screen.getByText("1 : 0")).toBeInTheDocument();
    
        act(() => {
          jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText("0 : 59")).toBeInTheDocument();
      });
})