# online-json-diff

https://json-diff.com

![screenshot](https://raw.github.com/justspamjustin/online-json-diff/master/img/screen.png)

## Setup

### Run with local Node environment
1. clone the repo
2. cd to the repo directory
3. run `npm install`
4. run `npm start`
5. go to [http://localhost:5000](http://localhost:5000)

### Run with docker
1. use docker image from docker hub
```
docker run -it --rm --name="json-diff" -p 5000:5000 jsondiff/online-json-diff
```

or build docker image yourself 
```
docker build -t online-json-diff . # run in repo root directory
docker run -it --rm --name="json-diff" -p 5000:5000 online-json-diff
```
2. go to [http://localhost:5000](http://localhost:5000)

## Contribute
[Check out the contributing.md file](https://github.com/justspamjustin/online-json-diff/blob/master/CONTRIBUTING.md)
