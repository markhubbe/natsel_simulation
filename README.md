# natsel_simulation
This webpage simulation tool was created to allow college students to explore basic concepts of population genetics. This is the first of (hopefully) several similar tools.

In this simulation, users can select the initial frequencies of two alleles and the relative phenotypes of the related genotypes, and then simulate a population over several generations to see how the fitness values will result in changes to the allele and genotype frequencies of the populations. 
This is an unrealistic simulation tool, as it does not take fitness as a probability of reproducing, but rather assumes all individuals will reproduce at a fixed rate defined by the fitness value. This simplification makes the connection between allele frequencies and expected genotypes (according the Hardy-Weinberg equilibrium) easier to understand. In terms of the simulation, that means the population size has no impact on the outcomes of the simulation, and just define the number of animated circles you see in the population each generation.
A future alternative version of the tool will incorporate fitness as a probability, rather than a fixed value. 

The tool was designed with a fixed width, to facilitate it being embedded in an iframe. Originally, this tool was designed to be an iframe inside a TopHat interactive course page, which has fixed and limited iframe widths. 
