import "./commands";
import "@cypress/code-coverage/support";
import addContext from "mochawesome/addContext";
// eslint-disable-next-line no-useless-escape
const titleToFileName = (title) => title.replace(/[:\/]/g, "");
Cypress.on("test:after:run", (test, runnable) => {
  if (test.state === "failed") {
    let parent = runnable.parent;
    let filename = "";
    while (parent && parent.title) {
      filename = `${titleToFileName(parent.title)} -- ${filename}`;
      parent = parent.parent;
    }
    filename += `${titleToFileName(test.title)} (failed).png`;
    addContext(
      {
        test,
      },
      `assets/${Cypress.spec.name}/${filename}`
    );
  }
  addContext({ test }, `assets/${Cypress.spec.name}.mp4`);
});


