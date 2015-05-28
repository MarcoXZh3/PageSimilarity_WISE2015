# Load Computer Modern font family, install if necessary
#install.packages('extrafont', dependencies=TRUE)
#install.packages('fontcm', dependencies=TRUE)
library(extrafont)
library(fontcm)
font_import()
loadfonts()


# Test case distribution
#pdf('TestCaseDistribution.pdf', width=8, height=5, pointsize=32, family='CMU Serif')
svg('TestCaseDistribution.svg', width=8, height=5, pointsize=32, family='CMU Serif')
data <- read.csv('TestcaseDistributions.txt', sep='\t', header=FALSE)
par(mar=c(1, 3, 0.5, 0.5))
hist(data$V1, breaks=220, col='black', main='', xlim=c(0, 220), ylim=c(0, 80), xaxt='n')
abline(h=500/109, lty=3, lwd=3)
mtext('Websites', side=1, line=-0.25)
mtext('Number of Webpages', side=2, line=2)
dev.off()

# Test case block tree size
#pdf('TreeSize.pdf', width=8, height=5, pointsize=32, family='CMU Serif')
svg('TreeSize.svg', width=8, height=5, pointsize=32, family='CMU Serif')
data <- read.csv('TreeSize.txt', sep='\t', header=FALSE)
layout(rbind(c(1, 1, 1, 1, 1, 1, 2)))

par(mar=c(1.5, 4, 1, 0.5))
barplot(data$V1, col='black', main='', xaxt='n', ylim=c(0, 1400))
abline(h=mean(data$V1), lty=3, lwd=3)
mtext('Test cases', side=1, line=0.25)
mtext('Block Tree Sizes', side=2, line=2)

par(mar=c(1.5, 0, 1, 0.5))
boxplot(data$V1, main='', xaxt='n', yaxt='n', ylim=c(0, 1400))
dev.off()
