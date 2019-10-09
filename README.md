# Asana Metrics

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.9.

## Disclaimer ##

A Api do Asana não tem uma forma de buscar todas as informações de uma issue em um único request.
Por isso o ideal é que você crie um backend para salvar estas informações ao invés de realizar as chamadas que esta API faz para cada issue.
Fiz alguns tratamentos de cache mas ainda sim são feitos muitas requisições para cada issue que tiver em seu projeto.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Troubleshooting

Para usuários linux que estiverem com problemas do auto-reload enquando desenvolvem, executar:
```bash
echo "fs.inotify.max_user_watches=524288" | sudo tee -a /etc/sysctl.conf

sudo sysctl -p
```