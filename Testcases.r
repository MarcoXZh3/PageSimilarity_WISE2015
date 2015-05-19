# Load Computer Modern font family, install if necessary
#install.packages('extrafont', dependencies=TRUE)
#install.packages('fontcm', dependencies=TRUE)
library(extrafont)
library(fontcm)
font_import()
loadfonts()

data <- read.csv('databases/TestcaseDistributions.txt', sep='\t', header=FALSE)
svg('databases/Testcases.svg', width=16, height=6.25, pointsize=32, family='CMU Serif')
par(mar=c(0, 2, 0, 0))
hist(data$V1, breaks=220, col='black', main='', xlab='', ylab='', xlim=c(0, 220), ylim=c(0, 70), xaxt='n')
dev.off()
