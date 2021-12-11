#! /usr/bin/env node
import { Command } from "commander";
import got from "got";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
import "colors";
import chalk from "chalk";

const program = new Command();
const url = "https://www.mayk.fi/tietoa-meista/ruokailu/";

console.log(chalk.hex("#CA2A2B").bold("Thank you for using mayk-ruoka!\n"));
console.log(
  chalk.whiteBright(
    `             .:*VVFMMNNNNMMFVV*:.             \n          .*FMNMVV**::::::***VMNMF*:          \n       .*VMMV*.                .*VMNF*.       \n     .*MNF*.                       *FNM*.     \n    :FNF*                            :FNM:    \n   *MM*.                               *MNV   \n .VNM:   :*VVVVVVVVVVVVVVVVVVVVVV*      .FNF. \n VNM:  :FNNNNNNNNNN$$NNNNNNNN$$NNF       .MNV \n:NN*  *NNFVVFNNNFVVVVVVMNNFVVVVVV*        *NN*\nVNF. *MV:   *NNN:      MNN*                VNF\nMNV .V:     *$$M.     .NNM:                *NM\nMN*         V$$F      :NNF                 *NN\nMNV         FNNV      *NNV                 *NM\nVNF.        MNN*      *NN*                 FNV\n:MN*       .NNN:      VNN*                *NN*\n VNM:      *NNM.      VNN*               :MNV \n .VNM:    :MNNV       VNNV      :*      :FNF. \n  .VNM*  *M$NN*       *NNM*.   :F*     *MNV.  \n    :FNMFNN$NV        .NNNNNNMNNV.   *FNF:    \n      *FNNNNF.         *MNNNNNM*. .*FNM*.     \n        *VMNF*:         .**V**.:*VMMF*.       \n          .*VMNMFV***::::***VFMNMF*.          \n             .:**VFFMMNNMMMFV**:.     `
  ) + "\n"
);

const options = program.opts();
program
  .version("1.1.0")
  .command("mayk-ruoka")
  .description("Get the menu for the day from the mayk ruokala")
  .option("-h, --help", "Help message")
  .option("-v, --version", "Check the version of the package")
  .option("-u, --url", "Show the URL of the food");

if (options.help) {
  console.log(
    program.helpInformation().replace(/\n$/, "").replace(/\n/g, "\n\n")
  );
} else if (options.version) {
  console.log(`mayk-ruoka is v${program.version()}`);
} else if (options.url) {
  console.log(`This module grabs the menu from ${url.underline}`);
} else {
  console.log(
    chalk.bold(`Fetching the menu from `).red + `${chalk.green(url)}...`
  );

  got(url)
    .then((response) => {
      const dom = new JSDOM(response.body);
      const ruokaMenu = dom.window.document.querySelectorAll(
        ".ruoka-template-header"
      );

      ruokaMenu.forEach((element) => {
        const ruokaPvm = element.querySelector(".ruoka-header-pvm").textContent;
        const ruoka = element.querySelector(".ruoka-header-ruoka").textContent;
        const kasvisruoka = element.querySelector(
          ".ruoka-header-kasvisruoka"
        ).textContent;

        console.log(
          `${ruokaPvm.replace(/\s+/g, "")}:`.bold,
          `${ruoka},`.yellow,
          `${kasvisruoka.replace(/  Kasvisruoka/g, "")}`.green
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
}
