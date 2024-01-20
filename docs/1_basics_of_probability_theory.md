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

** UPDATED PULL REQUEST **

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
We consider a random variable $x$ which has a set of possible outcomes $S = \{x_1, x_2, ...\}$. 


```python
# Defining variables
mu = 0
sigma = 0.05
sigma_range = np.arange(0.04, 0.5, 0.01)
sigma_length = len(sigma_range)
active = 1
x_range = np.linspace(-2, 2, 1000)
length = len(x_range)

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

fig.update_xaxes(range=[-1, 1])
fig.update_yaxes(range=[0, 10]) 
fig.data[active].visible = True

    
# Creation of the aditional images
steps = []
for i in range(sigma_length):
    step = dict(
        method = "update",
        args = [{"visible": [False] * length}],
        value = str(sigma_range[i])
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
    currentvalue = {"prefix": r"Standard deviation: "},
    pad = {"t": 50},
    steps = steps,
)]

# Updating the images for each step
fig.update_layout(
    sliders = sliders,
)

for i in range(sigma_length):
    fig['layout']['sliders'][0]['steps'][i]['label'] = ' %.2f ' % sigma_range[i]


fig
```


[^1]: Data source: [Wikipedia](https://en.wikipedia.org/wiki/Heat_capacities_of_the_elements_(data_page)), mainly the CRC Handbook of Chemistry and Physics.
[^2]: The data in this plot is the same as what Einstein used, but the curve in this plot is improved compared to what Einstein did, see [this blog post](https://quantumtinkerer.tudelft.nl/blog/footsteps-of-einstein/) for the backstory.
