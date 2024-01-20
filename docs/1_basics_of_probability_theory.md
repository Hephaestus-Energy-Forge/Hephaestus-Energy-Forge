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

# 1 Mathematische Beschreibung von Zufallssituationen

## 1.1 Wahrscheinlichkeitsräume


### Definition ($ \sigma $-Algebra)

Für eine Menge $ \Omega $ heißt $ \mathcal F \subset \mathcal P (\Omega) $ eine $ \sigma $-Algebra, wenn die Eigenschaften

a) $ \Omega \in \mathcal F $

b) $ A \in \mathcal F \Rightarrow A^C := \Omega \setminus A \in \mathcal F$

c) $ A_1, A_2, \dots \in \mathcal F \Rightarrow \bigcup_{i\geq 1} A_i \in \mathcal F $

erfüllt sind.

### Definition (Ereignisraum)
Sei $ \Omega \neq \emptyset $ und $ \mathcal F \subset \mathcal P (\Omega) $ eine $ \sigma $-Algebra. Dann heißt das Paar $ (\Omega, \mathcal F)$ Ereignisraum.

