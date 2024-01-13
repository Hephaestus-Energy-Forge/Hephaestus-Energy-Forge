---
jupyter:
  jupytext:
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.0'
      jupytext_version: 1.0.2
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
---

```python tags=["initialize"]
import pandas

from matplotlib import pyplot
import numpy as np
import math
from scipy.optimize import curve_fit
from scipy.integrate import quad
import plotly.offline as py
import plotly.graph_objs as go
from ipywidgets import interact, FloatSlider, Layout

from code.common import draw_classic_axes, configure_plotting

configure_plotting()
```

_(based on chapter 2.1 of the book)_

!!! success "Expected prerequisites"

    Before the start of this lecture, you should be able to:

    - Write down the energy spectrum of a quantum harmonic oscillator
    - Recall the definition of the partition function and calculate it for the quantum harmonic oscillator
    - Describe the equipartition theorem
    - Write down the Bose-Einstein distribution


!!! summary "Learning goals"

    After this lecture you will be able to:

    - Write down the expected number of excitations in a quantum harmonic oscillator (a bosonic mode) at temperature $T$ 




```python
# Defining variables
mu = 0
sigma = 1
sigma_range = np.arange(0.01, 1, 0.05)
active = int(len(sigma_range)/2)
x_range = np.linspace(-2, 2, 100)


# Create figure
fig = go.Figure()

def gauss(sigma, mu, x):
   return (1/np.sqrt(2*math.pi*sigma**2)) * math.e**(-(x-mu)**2/(2*sigma)**2)

for current_sigma in sigma_range:
    fig.add_trace(
        go.Scatter(
            visible = False,
            x = x_range,
            y = [gauss(current_sigma, mu, x) for x in x_range] ,
            mode = 'lines',
            line_color = 'blue',
            line_dash = 'dot',
            name = 'Gauss distribution sigma = ' + str(sigma),
            fill = 'tonextx',
            fillcolor = 'lightblue'
        ))

fig.data[active].visible = True

    
# Creation of the aditional images
steps = []
for i in range(int(len(fig.data))):
    step = dict(
        method = "update",
        args = [{"visible": [False] * len(fig.data)}],
        value = str(0.1*(i+1))
    )
    step["args"][0]["visible"][i] = True
    steps.append(step)

# Creating the slider
sliders = [dict(
    tickcolor = 'White',
    font_color = 'White',
    currentvalue_font_color = 'Black',
    active = active,
    name = r'Standard deviation',
    font_size = 16,
    currentvalue = {"prefix": r"Standard deviation:"},
    pad = {"t": 50},
    steps = steps,
)]

# Updating the images for each step
fig.update_layout(
    sliders = sliders,
)
fig
```


[^1]: Data source: [Wikipedia](https://en.wikipedia.org/wiki/Heat_capacities_of_the_elements_(data_page)), mainly the CRC Handbook of Chemistry and Physics.
[^2]: The data in this plot is the same as what Einstein used, but the curve in this plot is improved compared to what Einstein did, see [this blog post](https://quantumtinkerer.tudelft.nl/blog/footsteps-of-einstein/) for the backstory.
