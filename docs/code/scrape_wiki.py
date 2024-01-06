# -*- coding: utf-8 -*-
# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: light
#       format_version: '1.3'
#       jupytext_version: 0.8.6
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

# +
from pathlib import Path
import json

import wikitables

raw, = wikitables.import_tables('Heat capacities of the elements (data page)')

# +
elements = []
for index, row in enumerate(raw.rows):
    if not row[''].value.startswith('<'):
        continue
    description = row[''].value
    description = description[description.index('>') + 2:]
    c = raw.rows[index+1]['J/(mol·K)'].value
    if not isinstance(c, float):
        c = float(c.split()[-1])
    number, abbr, full_name, *remark = description.split()
    element = {
        'number': int(number),
        'abbr': abbr,
        'full_name': full_name,
        'remark': ' '.join(remark),
        'c': c,
    }
    elements.append(element)
    
Path('elements.json').write_text(json.dumps(elements))
