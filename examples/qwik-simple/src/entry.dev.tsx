import '@builder.io/qwik/qwikloader.js';
import { render } from '@builder.io/qwik';
import { Root } from './root';
import './index.css';

render(document.getElementById('app') as HTMLElement, <Root />);
