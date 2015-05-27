# Load Computer Modern font family, install if necessary
#install.packages('extrafont', dependencies=TRUE)
#install.packages('fontcm', dependencies=TRUE)
library(extrafont)
library(fontcm)
font_import()
loadfonts()


# Test case distribution
#pdf('Testcases.pdf', width=16, height=6.5, pointsize=32, family='CMU Serif')
svg('Testcases.svg', width=16, height=6.5, pointsize=32, family='CMU Serif')
data <- read.csv('TestcaseDistributions.txt', sep='\t', header=FALSE)
par(mar=c(1, 3, 0.5, 0.5))
hist(data$V1, breaks=220, col='black', main='', xlim=c(0, 220), ylim=c(0, 70), xaxt='n')
mtext('Websites', side=1, line=-0.25)
mtext('Number of Webpages', side=2, line=2)
dev.off()

# Test case block tree size
#pdf('TreeSize.pdf', width=16, height=6.5, pointsize=32, family='CMU Serif')
svg('TreeSize.svg', width=16, height=6.5, pointsize=32, family='CMU Serif')
data <- read.csv('TreeSize.txt', sep='\t', header=FALSE)
par(mar=c(1, 3, 0.5, 0.5))
barplot(data$V1, col='black', main='', xaxt='n', ylim=c(0, 1500))
mtext('Test cases', side=1, line=0)
mtext('Block Tree Sizes', side=2, line=2)
dev.off()
