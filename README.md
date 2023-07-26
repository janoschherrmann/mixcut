# Mixcut

## Local setup and installation

In order to start working on this project, clone it to your local machine and run `npm install` to install all dependencies. You can then run `npm run dev` in order to start up the project on your machine.

## How to contribute

To work on a new feature, create a new branch from `main`, with `git switch -c [your-branch-name]`. From there, you can use regular Git workflows to save your work and push it back to the remote repository. Please be aware that pushing directly to `main` is not allowed, in order to make sure that we don't break our production app. If you want to merge your changes back into `main`, please open up a pull request. After your code is reviewed and all checks run through smoothly, you're ready to merge.

## Semantic commit messages

In order to structure the code better, this project uses semantic commit messages. This means that commit messages have to follow some standards in order to be accepted. You can learn more about how this works here: [https://commitlint.js.org/#/](https://commitlint.js.org/#/)

## Requirements

## Known limitations

- Download a combination of both videos might not work if the videos don't both have an audio and a video stream
- It can also error if the browser in your environment doesn't have enough ressources (we tried to reduce the resources it takes, but it's still doing video encoding in the browser :D )
- Videos have to have a 16:9 or similar ratio, otherwise the editor experience might be negatively impacted
- It's currently not possible to revert the changes made to the file (there's no way to reset the editor to the initial state)
