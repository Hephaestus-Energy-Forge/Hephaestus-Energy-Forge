# Hephaestus-Energy-Forge

## Run

### Nix

Dependencies are managed with the nix package manager. After cloning the repo run

``` bash
nix develop
```

and then

``` bash
mkdocs serve
```

to serve the site.

### Docker

Build the image with the provided Dockerfile

``` bash
docker build -t website:latest .
```

Create a container from the image and run it:

``` bash
docker run --name website_container -p 8000:8000 --rm website:latest
```

### Manually

After cloning the repo run

``` bash
# create virtual environment
python -m venv .venv

# activate our virtual environment
source .venv/bin/activate

# update pip (optional)
python -m pip install -U pip

# install
pip install -r requirements.txt
```

to install all dependencies.

Then, run

``` bash
mkdocs serve
```

to serve the site.

