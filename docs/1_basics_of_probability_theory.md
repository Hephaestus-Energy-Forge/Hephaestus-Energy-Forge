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


!!! summary "Definition ($ \sigma $-Algebra)"

    Für eine Menge $ \Omega $ heißt $ \mathcal F \subset \mathcal P (\Omega) $ eine **$ \sigma $-Algebra**, wenn die Eigenschaften

    1. $ \Omega \in \mathcal F $

    2. $ A \in \mathcal F \Rightarrow A^C := \Omega \setminus A \in \mathcal F$

    3. $ A_1, A_2, \dots \in \mathcal F \Rightarrow \bigcup_{i\geq 1} A_i \in \mathcal F $

    erfüllt sind.

!!! summary "Definition (Ereignisraum)"

    Sei $ \Omega \neq \emptyset $ und $ \mathcal F \subset \mathcal P (\Omega) $ eine $ \sigma $-Algebra. Dann heißt das Paar $ (\Omega, \mathcal F)$ **Ereignisraum**.


Ist eine $ \sigma $-Algebra in $ \Omega $ festgelegt, so heißt jedes $ A \in \mathcal F $ ein **Ereignis**. 

!!! summary "Definition (Wahrscheinlichkeitsverteilung)"

    Sei $ (\Omega, \mathcal F)$ ein Ereignisraum. Eine Funktion $ P: \mathcal F \to [0,1] $ mit den Eigenschaften
    
    1. Normierung: $ P(\Omega) = 1 $
    
    2. $ \sigma $-Additivität: Für paarweise disjunkte Ereignisse $ A_1, A_2, \dots \in \mathcal F $ gilt $$ P (\bigcup_{i \geq 1} a_i) = \sum_{i \geq 1} P(A_i) $$
    
    heißt **Wahrscheinlichkeitsverteilung** auf $ (\Sigma, \mathcal F) $. Das Tripel $ (\Sigma, \mathcal F, P) $ heißt dann ein **Wahrscheinlichkeitsraum**.


