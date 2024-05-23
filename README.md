# POSR
This is a point of sale system designed for restaurants. It works well with touch screen systems.

This is built with **React + TypeScript + TailwindCSS + SurrealDB**

To run this project install first [Bun](https://bun.sh/), Bun is an alternative to NodeJS, then open a terminal or cmd window and run `bun install`.

Once done run `bun run dev` to start the dev server

Open another terminal/cmd window and download/install [SurrealDB](https://surrealdb.com/install)

Once done, run `surreal start --log full --user root --pass root file:./posr.db` to start the instance of SurrealDB.
This will start SurrealDB server.

Your web application should be accessible at http://localhost:5173/, default login is 0000

## This project is still in development, some features might not work as expected
[Features](/docs/readme.md)
