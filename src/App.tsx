import type { Component } from 'solid-js';

import { CreateScene, InitializeRendering } from './services/renderScene'
//import CreateScene from './services/main'

import logo from './logo.svg';
import styles from './App.module.css';

const App: Component = () => {
  const renderer = CreateScene()

  //document.body.appendChild(renderer)

  InitializeRendering()
  return (
    <div class={styles.App}>
      <ul class="block absolute right-16 top-16 space-y-8">
        <li class="button-width block text-7xl font-mono text-center text-stone-200">Patrick J Grady</li>
        <li><a class="button-width block text-7xl font-mono text-right text-stone-400 bg-zinc-900 pt-8 px-48 pb-16 button-radius hover:text-stone-200 hover:bg-zinc-600" href="https://www.artstation.com/patrickjgrady">Artstation</a></li>
        <li><a class="button-width block text-7xl font-mono text-right text-stone-400 bg-zinc-900 pt-8 px-48 pb-16 button-radius hover:text-stone-200 hover:bg-zinc-600" href="https://itch.io/profile/patrickjgrady">Itch.io</a></li>
        <li><a class="button-width block text-7xl font-mono text-right text-stone-400 bg-zinc-900 pt-8 px-48 pb-16 button-radius hover:text-stone-200 hover:bg-zinc-600" href="https://github.com/patrick-j-grady">Github</a></li>
      </ul>
    </div>
  );
};

export default App;

/*
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          class={styles.link}
          href="https://github.com/solidjs/solid"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Solid
        </a>
      </header>
*/