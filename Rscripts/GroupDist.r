# Install necessary packages
#install.packages('scatterplot3d', dependencies=TRUE)
library(extrafont)
library(fontcm)
font_import()
loadfonts()

data <- t(read.csv('preClassification.txt', sep='\t', header=FALSE));

svg('preClassification.svg', width=16, height=7, pointsize=20, family='CMU Serif')
layout(rbind(c(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)));

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
    par(oma=c(0, 0, 0, 0));  
    hist(t, main='', xlab='', ylab='', mar=c(0, 0, 0, 0))
    #boxplot(col)
} # for (i in 1:nrow(data))

dev.off();
