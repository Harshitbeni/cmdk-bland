# Aegis Command Palette Prototype

This is the runnable prototype environment for the take-home exercise.

Right now it only sets up the window around the future command palette:

- A blank white canvas.
- Two image background options.
- Main controls in the bottom-left corner.
- Secondary controls in the bottom-right corner.
- A reserved center area where the command palette will be added later.
- Agentation in development mode, so you can click on the interface and leave visual notes for the coding agent.
- Interface Kit in development mode, so you can visually inspect and tune styling in the browser.

No command palette UI has been added yet.

## How To Run

1. Open this folder in your terminal.
2. Run:

   ```bash
   npm install
   npm run dev
   ```

3. Open the local URL shown in the terminal. It will usually be:

   ```text
   http://127.0.0.1:5173/
   ```

## Current Controls

- Bottom-left: main prototype controls.
- Bottom-right: background controls.
- Background options: Blank, Image A, Image B.

## Notes

Agentation is only loaded while running the local development version. It is used for visual feedback and annotations during design/build iterations.

Interface Kit is also only loaded while running the local development version. It adds a paintbrush control for inspecting and styling elements in the browser.
