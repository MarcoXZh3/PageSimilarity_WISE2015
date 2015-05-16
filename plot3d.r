# Install necessary packages
#install.packages('scatterplot3d', dependencies=TURE)
library(scatterplot3d);

# Clear the workspace
rm(list = ls(all=TRUE));

#svg("1.svg", width=16, height=8, pointsize=28, family="serif")
setEPS()
postscript("1.eps", width=16, height=8, pointsize=28, family="serif")

#m <- rbind(c(1, 2, 3, 4, 5), c(6, 7, 8, 9, 10));
m <- rbind(c(1, 2));
layout(m);

# Read all data
data <- read.csv('trainset.txt', sep='\t', header=TRUE);
rows <- nrow(data);

#numbers <- 10;
#for (i in 1:numbers) {
for (i in c(8, 10)) {
    x1 <- c();
    y1 <- c();
    yes <- c();
    x2 <- c();
    y2 <- c();
    no <- c();
    for (j in 1:rows) {
        ncd <- data[[2*i+1]][j];
        cat <- as.character(data[[2*i+2]][j]);
        if (cat == 'YES') {
            x1 <- c(x1, data[[1]][j]);
            y1 <- c(y1, data[[2]][j]);
            yes <- c(yes, ncd);
        } else {
            x2 <- c(x2, data[[1]][j]);
            y2 <- c(y2, data[[2]][j]);
            no <- c(no, ncd);
        } # else if (cat == 'YES')
    } # for (j in 1:rows)
    scatterplot3d(x1, y1, yes, main='', pch=4, xlim=c(0, 50), ylim=c(0, 50), zlim=c(0, 1600),
                  xlab='', ylab='', zlab='', angle=30, mar=c(5,3,0,0));
    par(new=TRUE);
    scatterplot3d(x2, y2, no, main='', pch=20, xlim=c(0, 50), ylim=c(0, 50), zlim=c(0, 1600),
                  xlab=sprintf('Subset %d', i), ylab='', zlab=sprintf('%40s', 'NCD'), angle=30, mar=c(5,3,0,0));
    legend(6.5, 5.8, pch=c(4, 20), c('YES', 'NO'));
    par(new=FALSE);
} # for (i in 1:numbers)

dev.off();
