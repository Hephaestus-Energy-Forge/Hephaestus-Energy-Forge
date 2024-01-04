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
from scipy.optimize import curve_fit
from scipy.integrate import quad
import plotly.offline as py
import plotly.graph_objs as go
from ipywidgets import interact, FloatSlider, Layout

from common import draw_classic_axes, configure_plotting

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
    - Compute the expected energy $E$ and heat capacity $C$ of a quantum harmonic oscillator as a function of $T$
    - Analyze the scaling of $E$ and $C$ in the high- and low-T limits.    
    - Write down the total energy stored in the vibrations of the atoms in an Einstein solid
    - Explain how quantum mechanical effects influence the energy and heat capacity of solids in the Einstein model


## Classical limit of heat capacity

Let us look at the heat capacities of different chemical elements[^1]:

```python

elements = pandas.read_json('elements.json')
elements.full_name = elements.full_name.str.capitalize()
hovertext = elements.T.apply(
    lambda s: f'<sup>{s.number}</sup>{s.abbr} '
              f'[{s.full_name}{", " * bool(s.remark)}{s.remark}]'
)

go.Figure(
    data=[
        go.Scatter(
            x=elements.number,
            y=elements.c / 8.314,
            mode='markers+text',
            textposition='top center',
            hovertext=hovertext,
            hoverinfo='text'
        ),
    ],
    layout=go.Layout(
        title='Heat capacity of various chemical elements',
        autosize=True,
        yaxis=go.layout.YAxis(
            title='$C/k_B$',
            tick0=1,
            dtick=2,
        ),
        xaxis=go.layout.XAxis(
            title='Atomic number'
        ),
        hovermode='closest',
    ),
)
```

An empirical observation, also known as the **law of Dulong–Petit** (1819):

> In most materials the heat capacity per atom $C \approx 3k_B$

This corresponds to what we know from statistical physics.
Assuming that each atom is trapped in a parabolic potential created by its neighboring atoms, the [equipartition theorem](https://en.wikipedia.org/wiki/Equipartition_theorem) states that each degree of freedom contributes $k_B/2$ to the heat capacity.
Because we consider a 3D solid, each atom contains 3 spatial and 3 momentum degrees of freedom.
Therefore, the total heat capacity per atom is $C = 3k_B$.

### Complication
However, observe in the figure below that the measured  heat capacity of diamond drops below the prediction of the law of Dulong–Petit at low temperatures[^2].
This suggests that we need a different model to describe the heat capacity at low temperatures.
To explain this puzzle we will follow the reasoning of Einstein.

```python
# Data from Einstein's paper
T = [222.4, 262.4, 283.7, 306.4, 331.3, 358.5, 413.0, 479.2, 520.0, 879.7, 1079.7, 1258.0]
c = [0.384, 0.578, 0.683, 0.798, 0.928, 1.069, 1.343, 1.656, 1.833, 2.671, 2.720, 2.781]

fig, ax = pyplot.subplots()
ax.scatter(T, c)
ax.set_xlabel('$T [K]$')
ax.set_ylabel('$C/k_B$')
ax.set_ylim((0, 3))
ax.set_title('Heat capacity of diamond');
```

We observe that:

* We obtain the law of Dulong–Petit at high temperatures
* $C$ depends strongly on the temperature
* As $T \rightarrow 0$, $C \rightarrow 0$


## The Einstein model
The equipartition theorem assumed that each atom can be modeled as a classic harmonic oscillator.
However, at low temperatures this led to a discrepancy in the heat capacity between the law of Dulong–Petit and the observed heat capacity.
We know from quantum mechanics that the quantum mechanical behavior of harmonic oscillators is different, especially at low energies.
Let us follow this idea by Einstein and consider each atom an independent *quantum* harmonic oscillator.
Because all atoms are the same, let us also say that they all oscillate with the same frequency $\omega_0$.  
In short, this is our starting point:

* The atoms are independent quantum harmonic oscillators
* Each atom has the same frequency $\omega_0$

For simplicity, we consider a 1D quantum harmonic oscillator (because the harmonic oscillator Hamiltonian is [separable](https://en.wikipedia.org/wiki/Separable_partial_differential_equation), a 3D harmonic oscillator is similar to 3 independent 1D ones).  

As a quick reminder, take a look at the spectrum and the wavefunctions of a 1D quantum harmonic oscillator.
```python
import math
from numpy.polynomial.hermite import Hermite

def ho_evec(x, n, no_states):

    """
    Calculate the wavefunction of states confined in the harmonic oscillator

    Input:
    ------
    x: numpy array of x coordinates (in units of hbar.omega)
    n: n^th bound state in the oscillator
    no_states: no of states confined

    Returns:
    --------
    Wavefunctions

    """

    # calculate hermite polynomial
    vec = [0] * no_states
    vec[n] = 1/2
    Hn = Hermite(vec)

    return ((1/np.sqrt(math.factorial(n)*2**n))*
            pow(np.pi,-1/4)*
            np.exp(-pow(x, 2)/2)*
            Hn(x))

def h0_ener(n):
    """
    Calculate the energy of nth bound state
    """
    return (n + 1/2)

x = np.linspace(-4, 4, 100) #units of hbar.omega
no_states = 7 #no of bound states confined in the quantum well

omega = 1.0 #frequency of harmonic oscillator
V = 0.5*(omega**2)*(x**2)

fig, ax = pyplot.subplots(figsize=(10, 7))

for i in range(no_states):

    ax.hlines(h0_ener(i), x[0], x[len(x)-1], linestyles='dotted', colors='k')

    ax.plot(x, ho_evec(x, i, no_states) + h0_ener(i)) #plot wavefunctions


    # annotate plot
    ax.text(x[len(x)-1], h0_ener(i)+1/4, r'$\Psi_{%2i} (x)$' %(i),
             horizontalalignment='center', fontsize=14)

    ax.text(1/4, h0_ener(i)+1/4, '$E_{%2i}$' %(i),
             horizontalalignment='center', fontsize=14)

    if i==0:
        ax.text(x[0]+1/4, h0_ener(i)/4, r'$\frac{\hbar\omega_0}{2}$',
                 horizontalalignment='center', fontsize=14)

        ax.annotate("", xy=(x[0]+1/2, h0_ener(i)-1/2),
                    xytext=(x[0]+1/2, h0_ener(i)),
                    arrowprops=dict(arrowstyle="<->"))
    elif i==1:
        ax.text(x[0]+1/4, h0_ener(i-1)+1/3, r'$\hbar\omega_0$',
                 horizontalalignment='center', fontsize=14)

        ax.annotate("", xy=(x[0]+1/2, h0_ener(i)),
                    xytext=(x[0]+1/2, h0_ener(i-1)),
                    arrowprops=dict(arrowstyle="<->"))

    ax.fill_between(x, h0_ener(i), ho_evec(x, i, no_states) + h0_ener(i), alpha=0.5)

ax.plot(x, V, 'k', linewidth=1) #plot harmonic potential

# Move left y-axis and bottim x-axis to centre, passing through (0,0)
ax.spines['left'].set_position('center')
ax.spines['bottom'].set_position(('data', 0.0))

# Eliminate upper and right axes
ax.spines['right'].set_color('none')
ax.spines['top'].set_color('none')

# Eliminate x and y axes labels
ax.set_yticklabels([])
ax.set_xticklabels([])

# Set x and y labels
#ax.set_xlabel('X '+ r'($\sqrt{\hbar/m\omega_0}$)', fontsize=14)
ax.set_xlabel('Displacement x ', fontsize=14)
ax.set_ylabel('$E_n/\hbar\omega_0$', fontsize=14)
ax.yaxis.set_label_coords(0.5,1)
```

So a quantum harmonic oscillator has discrete energy levels with energies

$$
E_n=\left(n+\frac{1}{2}\right)\hbar\omega_0,
$$

where $\omega_0$ is the eigenfrequency of the oscillator.
This oscillator is a so-called *bosonic mode*: when its wave function is in the $n$-th excited state, we say that it is occupied by $n$ bosonic excitations.
At temperature $T$, the average occupation number is given by the Bose-Einstein distribution:

$$
\langle n \rangle = n_B(\omega,T) = \frac{1}{e^{\hbar\omega/k_B T} - 1}.
$$

Substituting $n_B$ into the expression for the oscillator energy, we obtain the expectation value of the energy stored in the oscillator at temperature $T$—the *thermal energy* (which, for brevity, we will simply denote as the total energy $E$):

\begin{align}
E(T) &= (n_B(\omega_0,T) + \frac{1}{2})\hbar\omega_0 \\
&= \frac{\hbar\omega_0}{e^{\hbar\omega_0/k_B T}-1} + \frac{1}{2}\hbar\omega_0
\end{align}

A plot of the Bose-Einstein distribution and the expected value of the energy are shown below.

```python
xline = [1, 1];
yline = [0, 1.5];
fig, (ax, ax2) = pyplot.subplots(ncols=2, figsize=(10, 5))
omega = np.linspace(0.1, 2)
ax.plot(omega, 1/(np.exp(omega) - 1), '-', xline, yline, 'r--')
ax.set_ylim(0, top=3)
ax.set_xlim(left=0)
ax.set_xlabel('$\hbar \omega$')
ax.set_xticks([0])
ax.set_xticklabels(['$0$'])
ax.set_ylabel('$n_B$')
ax.set_yticks([0,1, 2])
ax.set_yticklabels(['$0$','$1$', '$2$'])
draw_classic_axes(ax, xlabeloffset=.2)

temps = np.linspace(0.01, 2)
ax2.plot(temps, 1/2 + 1/(np.exp(1/temps)-1), '-', [0.55,0.55], [0, 0.7], 'r--')
ax2.set_ylim(bottom=0)
ax2.set_xlabel('$k_B T$')
ax2.set_xticks([0])
ax2.set_xticklabels(['$0$'])
ax2.set_ylabel(r"$E$")
ax2.set_yticks([1/2])
ax2.set_yticklabels([r'$\hbar\omega_0/2$'])
draw_classic_axes(ax2, xlabeloffset=.15)
ax2.text(0.65, 0.35, r'$k_B T=\hbar \omega_0$', ha='left', color='r');
```
The left plot shows the Bose-Einstein distribution as a function of the energy $\hbar \omega$. It demonstrates that the lower the oscillator frequency, the higher its occupation number.

The right plot shows the expectation value of the total energy stored in the harmonic oscillator as a function of the temperature.
For high $T$, $ E $ is linear in $T$: the same as the energy of a classical harmonic oscillator.
For low $T$, thermal fluctuations do not have enough energy to excite the vibrational motion and therefore all atoms occupy the ground state ($n = 0$).
Hence, $ E $ converges towards the constant value of $\hbar \omega_0/2$—the _zero-point energy_.
Because the energy in the oscillator becomes approximately constant when $k_B T\ll\hbar \omega_0$, we can already conclude that the heat capacity drops strongly with decreasing temperature.

Having found an expression for $E(T)$, we now calculate the heat capacity per harmonic oscillator explicitly by using its definition:

\begin{align}
C(T) &\equiv \frac{d E(T) }{d T}\\
&= -\frac{\hbar\omega_0}{\left(e^{\hbar\omega_0/k_B T}-1\right)^2}\frac{d}{d T}\left(e^{\hbar\omega_0/k_B T}-1\right)\\
&= \frac{\hbar^2\omega_0^2}{k_B T^2}\frac{ e^{\hbar\omega_0/k_B T}}{\left(e^{\hbar\omega_0/k_B T}-1\right)^2}\\
&=k_B \left(\frac{\hbar\omega_0}{k_B T}\right)^2\frac{ e^{\hbar\omega_0/k_B T}}{\left(e^{\hbar\omega_0/k_B T}-1\right)^2}
\end{align}

We can rewrite this equation into

$$
C(T) = k_b \left(\frac{T_E}{T}\right)^2\frac{e^{T_E/T}}{(e^{T_E/T} - 1)^2},
$$

where we introduced the *Einstein temperature* $T_E \equiv \hbar \omega_0 / k_B$.

The Einstein temperature $T_E$ is the characteristic temperature below which the thermal excitations of the quantum harmonic oscilator start to "freeze out". 
In other words, there is not enough thermal energy to excite the harmonic oscillators above the ground state.
Consequently, it is also the temperature scale for which the heat capacity of an Einstein solid starts significantly decreasing.
Because atoms in different materials have a different eigenfrequency $\omega_0$, the Einstein temperature is a material-dependent parameter.
Check the plot below to observe how the temperature dependence of the heat capacity changes with $T_E$.

```python
# Defining variables
y_line = [0, 0.92];
T_max = 3
temps = np.linspace(0.01, T_max, 750)
N_values = 20
T_E_max = 2
l_width = 1.5
N_active = 9

# Create figure
fig = go.Figure()

# Heat capacity
def c_einstein(T, T_E):
    x = T_E / T
    return 3 * x**2 * np.exp(x) / (np.exp(x) - 1)**2

# Add traces, one for each slider step
for T_E in np.linspace(0.1, T_E_max, N_values):
    fig.add_trace(
        go.Scatter(
            visible = False,
            x = [0, T_max],
            y = [1, 1],
            mode = 'lines',
            line_color = 'lightblue',
            line_dash = 'dot',
            name = "Equipartition theorem",
        ))
    fig.add_trace(
        go.Scatter(
            visible = False,
            x = temps,
            y = c_einstein(temps, T_E)/3,
            mode = 'lines',
            line_color = 'blue',
            line_dash = 'dot',
            name = 'Einstein model',
            fill = 'tonextx',
            fillcolor = 'lightblue'
        ))
    fig.add_trace(
        go.Scatter(
            visible = False,
            x = [T_E, T_E],
            y = y_line,
            mode = 'lines',
            line_color = 'red',
            line_dash = 'dot',
            name =  r'$T = T_E = \hbar \omega/k_B$'
        ))

    
# Initial starting image
N_trace = int(len(fig.data)/N_values) # Number of traces added per step
for j in range(N_trace):
    fig.data[N_active*N_trace+j].visible = True

    
# Creation of the aditional images
steps = []
for i in range(int(len(fig.data)/N_trace)):
    step = dict(
        method = "restyle",
        args = [{"visible": [False] * len(fig.data)}],
        value = str(0.1*(i+1))
    )
    for j in range(N_trace):
        step["args"][0]["visible"][N_trace*i+j] = True  # Toggle i'th trace to "visible"
    steps.append(step)

# Creating the slider
sliders = [dict(
    tickcolor = 'White',
    font_color = 'White',
    currentvalue_font_color = 'Black',
    active = N_active,
    name = r'Einstein temperature',
    font_size = 16,
    currentvalue = {"prefix": r"Einstein temperature:"},
    pad = {"t": 50},
    steps = steps,
)]

# Updating the images for each step
fig.update_layout(
    sliders = sliders,
    showlegend = True,
    plot_bgcolor = 'rgb(254, 254, 254)',
    width = 700,
    height = 580,
    xaxis = dict(
        range=[0, T_max],
        visible = True,
        showticklabels = True,
        showline = True,
        linewidth = l_width, 
        linecolor = 'black',
        gridcolor = 'white',
        tickfont = dict(size = 16)),
    yaxis = dict(
        range = [0, 1.1],
        visible = True,
        showticklabels = True,
        showline = True,
        linewidth = l_width, 
        linecolor = 'black',
        gridcolor = 'white',
        tickfont = dict(size = 16)),
    title = {'text': r'Heat capacity of the Einstein model and the equipartition theorem',
        'y':0.9,
        'x':0.45,
        'xanchor': 'center',
        'yanchor': 'top'},
    xaxis_title = r'$T$',
    yaxis_title = r'$C/K_B$',
    legend = dict(
    yanchor="bottom",
    y = 0.1,
    xanchor = "right",
    x = 0.99,
    bgcolor = "white",
    bordercolor = "Grey",
    borderwidth = 1)
)  
      
# Edit slider labels and adding text next to the horizontal bar indicating T_E
for i in range(N_values):
    fig['layout']['sliders'][0]['steps'][i]['label'] = ' %.1f ' % (T_E_max*i/N_values + T_E_max/N_values)

fig
```

Let us now compare the Einstein model with the experimental data.
The plot below shows a fit of the Einstein model to the experimental data for the heat capacity of diamond, and we observe that they agree really well.

```python
fit = curve_fit(c_einstein, T, c, 1000)
T_E = fit[0][0]
delta_T_E = np.sqrt(fit[1][0, 0])

fig, ax = pyplot.subplots()
ax.scatter(T, c, label = 'Diamond')

temps = np.linspace(10, T[-1], 100)
ax.plot(temps, c_einstein(temps, T_E), label = 'Einstein model');

ax.set_xlabel('$T[K]$')
ax.set_ylabel('$C/k_B$')
ax.set_ylim((0, 3))
ax.set_title('Heat capacity of diamond and the Einstein model')
ax.legend();
```

## Conclusions

1. The law of Dulong–Petit is an observation that for most materials: $C \approx 3k_B$ per atom.
2. The Einstein model describes each atom in a solid as an independent quantum harmonic oscillator with the same eigenfrequency $\omega_0$.
3. Using the Bose–Einstein distribution, we derived expressions for $E$ and $C$ as a function of the temperature.
4. At sufficiently low $T$, the thermal excitations freeze out, resulting in $E = \hbar \omega_0/2$.
5. The Einstein model correctly predicts that the heat capacity drops to 0 as $T\rightarrow 0$.


## Exercises
Exercises with an asterisk (*) are considered to be at the essential/basic level

### Warm-up exercises*

1. Why is the heat capacity per atom of an ideal gas typically $3k_B/2$ and not $3 k_B$?
2. What is the high-temperature heat capacity of an atom in a solid with two momentum and two spatial coordinate degrees of freedom?
3. Sketch the heat capacity of an Einstein solid for two different values of $T_E$


### Exercise 1*: The harmonic oscillator and the Bose-Einstein distribution
The Bose Einstein distribution describes the expected number of bosonic excitations (also known as quasiparticles) in a harmonic oscillator at temperature $T$. We will use it throughout the course to analyze the vibrations of atoms. In the Einstein model, each atom is modeled as an independent harmonic oscillator. The expected number of excitations (phonons) in this oscillator is given by the Bose-Einstein distribution. Here we study this number in more detail, and relate it to the energy and heat capacity of the oscillator. We consider an oscillator with eigenfrequency $\omega_0$

1. Write down the expected number of phonons in this oscillator as a function of temperature. When do you consider this equation to be in the high- or low-T limit?. Derive its scaling with temperature in the high-temperature limit (use a Taylor expansion). Argue if this high-temperature number of phonons is reasonable given the thermal energy $k_BT$. 
2. Write down the expected energy $E$ of the oscillator at temperature $T$. Derive the scaling of $E$ with temperature in the high-temperature limit. Discuss the relation of your answers to the expected number of phonons in the oscillator (derived in the previous subquestion). 
3. Derive the heat capacity of this harmonic oscillator in the high-T limit.
4. Now consider the low-temperature regime. How many phonons do you expect in the harmonic oscillator at zero temperature? If you now increase temperature, at what temperature do you expect this number to start changing significantly? How does the number scale with temperature in this low-temperature limit (describe in words)? From this, argue how the energy and heat capacity of the oscillator scale with $T$ in the low-T limit.
5. Explain which behaviour of the function $1/(e^{-\hbar\omega/k_BT}-1)$ tells you it is *not* the Bose Einstein distribution. 

### Exercise 2: The quantum harmonic oscillator - connection with statistical physics
In statistical physics, you have also analyzed a harmonic oscillator at temperature $T$. You did so by calculating its partition function. In this exercise, we compare the results of the current lecture to that analysis. 

1. Write down the eigenenergies $E_n$ of a 1D quantum harmonic oscillator.
2. Compute the partition function $Z$ of the harmonic oscillator, using

    $$ Z = \sum_n e^{-\beta E_n}.$$

3. Recall from statistical mechanics that the expected energy is given by $E = -d \ln(Z)/d\beta$. Compute $E$ and compare your answer to that found in exercise 1.2. 
4. Compute the heat capacity. Check that in the high-temperature limit you get the same result as in Exercise 1.3.
5. What is the expected value of $n$? (no calculations, just what you expect).


### Exercise 3*: Total heat capacity of a diatomic material
One of the assumptions of the Einstein model is that every atom in a solid oscillates with the same frequency $\omega_0$. However, if the solid contains different types of atoms, it is unreasonable to assume that the atoms oscillate with the same frequency. Here we consider a lithium crystal that consists for 7.5% out of $^6$Li atoms and for 92.5% out of $^7$Li atoms. These are both [stable isotopes](https://en.wikipedia.org/wiki/Isotopes_of_lithium) and the percentages correspond to their natural abundance. Here, we will calculate the heat capacity of this crystal by extending the Einstein model to take into account the different masses of these isotopes. We call the total number of atoms in the crystal $N$.

1. Assume that the harmonic force constant (spring constant) $k$ experienced by each atom is the same. What are the two eigenfrequencies of the two different isotopes in the lithium crystal?
2. The lithium crystal is kept at temperature $T$. Write down the expectation value of the energy stored in the vibrations of the $^6$Li atoms. Do the same for the $^7$Li atoms. Write down the expectation value of the total energy stored in the vibrations of all the atoms in the lithium crystal.
3. Compute the heat capacity of the lithium crystal as a function of $T$. Below what temperature are all the atoms mostly in their ground state?


[^1]: Data source: [Wikipedia](https://en.wikipedia.org/wiki/Heat_capacities_of_the_elements_(data_page)), mainly the CRC Handbook of Chemistry and Physics.
[^2]: The data in this plot is the same as what Einstein used, but the curve in this plot is improved compared to what Einstein did, see [this blog post](https://quantumtinkerer.tudelft.nl/blog/footsteps-of-einstein/) for the backstory.
