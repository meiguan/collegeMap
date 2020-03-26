# New York College Map

This project leverages the [Education Data Portal Api](https://educationdata.urban.org/documentation/) published by Urban Institute and the [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) API to create a map of 4-year Private/ Non-Profit and 4-Year Public Universities in New York State with >1000 students enrolled. A potential audience of this map could be a high school student looking to do a brief exploration of Universities. It mainly aims to highlight a key metric often overlooked -- 150% completion rate. This metric measures the share of students who enroll in college and graduate within 6 years time.

Mapping colleges in the New York

-   4 Year Private / Non-Profit
-   4 Year Public
-   Institution Size > 1000 enrollment

Methods

-   Through access to the Urban Institute Education Data Portal API, data
      was downloaded and processed in 2 Jupyter Notebooks--can be located in
      this github repo.
-   In general the admissions data only references the latest year
          available via the API, 2017. And for the data points related to family
          income, completers, and first generation status, these points were
          averaged across the years available on the API from 2015 to 2016. For
          metrics not available/ found via the API, it is noted as NA.

Data Sources
- U.S. Department of Education, National Center for Education Statistics. (2019).
    The Condition of Education 2019 (NCES 2019-144), [Undergraduate Retention
      and Graduation Rates](https://nces.ed.gov/programs/coe/indicator_ctr.asp).
- Urban Institute. [Education Data Portal.](https://educationdata.urban.org/documentation/colleges.html#overview) Full Api.

[Link to Project](https://meiguan.github.io/collegeMap/)
