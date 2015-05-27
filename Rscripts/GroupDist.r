# Install necessary packages
#install.packages('scatterplot3d', dependencies=TRUE)
library(extrafont)
library(fontcm)
font_import()
loadfonts()

data <- t(read.csv('preClassification.txt', sep='\t', header=FALSE));

svg('preClassification.svg', width=16, height=6.5, pointsize=22, family='CMU Serif')
m <- rbind(c(1, 3, 5, 7 ,9), c(1, 3, 5, 7 ,9),
           c(2, 4, 6, 8, 10),
           c(11, 13, 15, 17, 19), c(11, 13, 15, 17, 19),
           c(12, 14, 16, 18, 20));
layout(m);

for (i in 1:ncol(data)) {
    col <- na.omit(as.data.frame(data[,i]));
    dist <- c();
    index <-1;
    for (j in 1:nrow(col)) {
        for (k in 1:col[[1]][j]) {
            dist[index] <- j;
            index <- index +1;
        } # for (k in 1:col[[1]][j])
    } # for (j in 1:nrow(col))
    par(mar=c(2.5, 2, 1, 1))
    hist(dist, main='', xlab='', ylab='', xlim=c(0, j+1), ylim=c(0, 30), xaxt='n')
    axis(1)
    par(mar=c(2, 2, 0, 1))
    boxplot(dist, horizontal=TRUE, xaxt='n')
    mtext(sprintf('Subset %d', i), side=1, line=0.5)
} # for (i in 1:nrow(data))

dev.off();
