import React from 'react'
import "core-js"
import "jest-canvas-mock"
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';


global.React = React;
global.render = render;
global.userEvent = userEvent;
