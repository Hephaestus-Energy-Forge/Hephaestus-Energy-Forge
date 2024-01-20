from IPython import get_ipython
import matplotlib


def configure_plotting():
    # Configure matplotlib
    ip = get_ipython()
    ip.config['InlineBackend']['figure_format'] = 'svg'

    # Fix for https://stackoverflow.com/a/36021869/2217463
    ip.config['InlineBackend']['rc'] = {}
    ip.enable_matplotlib(gui='inline')

    matplotlib.rcParams['text.usetex'] = False
    matplotlib.rcParams['figure.figsize'] = (10, 7)
    matplotlib.rcParams['font.size'] = 16


def draw_classic_axes(ax, x=0, y=0, xlabeloffset=.1, ylabeloffset=.07):
    ax.set_axis_off()
    x0, x1 = ax.get_xlim()
    y0, y1 = ax.get_ylim()
    ax.annotate(
        ax.get_xlabel(), xytext=(x1, y), xy=(x0, y),
        arrowprops=dict(arrowstyle="<-"), va='center'
    )
    ax.annotate(
        ax.get_ylabel(), xytext=(x, y1), xy=(x, y0),
        arrowprops=dict(arrowstyle="<-"), ha='center'
    )
    for pos, label in zip(ax.get_xticks(), ax.get_xticklabels()):
        ax.text(pos, y - xlabeloffset, label.get_text(),
                ha='center', va='bottom')
    for pos, label in zip(ax.get_yticks(), ax.get_yticklabels()):
        ax.text(x - ylabeloffset, pos, label.get_text(),
                ha='right', va='center')
