# PWA: E3 2024-1

## Integrantes
- Benjamin Gonzalez
- Alejandro Plaza
- Juan Pablo Vergara Lobos

## Estructura del Proyecto

El proyecto esta organizado en funcion de una carpeta principal:

- `/public`: Contiene todos los archivos que se serviran directamente y los que cachearemos. Esto incluye archivos HTML, imagenes y scripts.
  - `/scripts`: Aca iran todos los scripts que use el proyecto.

## Scripts de NPM

Para desarrollar y probar localmente la aplicación, utilizamos el script `npm run dev`. Este script aprovecha `concurrently` para ejecutar dos procesos simultáneamente:

1. **PostCSS**: Observa cambios en el archivo `src/styles.css`, procesa el CSS utilizando PostCSS, y luego lo coloca en `public/styles.css`. Esto permite aplicar transformaciones inmediatas al CSS. En caso de no usar esto, habria que reiniciar el servidor leugo de cada cambio en el css.
   
2. **Live Server**: Inicia un servidor local que sirve los archivos desde la carpeta `public`. Cualquier cambio en los archivos dentro de esta carpeta, incluyendo los realizados por PostCSS, se reflejara directo en el html.
### Cómo Correr el Proyecto
1. **Instalar las dependencias**
```bash
npm i
```
2. **Lenvatar el servidor y compilar el postcss**

```bash
npm run dev
```
En caso de ejecutar en Windows, ejecutar el siguiente comando:
```bash
npm run dev:windows
```

## Estilos
Para estilizar se usan dos dependencias:

1. **Tailwind**
2. **DaisyUI**