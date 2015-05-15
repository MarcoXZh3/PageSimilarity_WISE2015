# Install and load necessary packages
#install.packages('e1071', dependencies=TRUE);              # Naive Bayes Classification is here
library('e1071')


# Clear the workspace
rm(list = ls(all=TRUE))

numbers <- 10
# Read all sets of data into the 'alldata'
alldata <- list()
for (i in 1:numbers) {
    alldata[[i]] <- read.csv(sprintf('classification%02d.txt', i), sep='\t', header=TRUE);
} # for (i in 1:numbers)
cols <- ncol(alldata[[i]]);                                 # number of columns
rows <- nrow(alldata[[i]]);

# Run Naive Bayes Classification among all the sets
for (i in 1:numbers) {
    trainset <- alldata[[i]];
    classifier<-naiveBayes(trainset[,3:cols-1], trainset[,cols]);
    for (j in 1:numbers) {
        if (i == j)
            next;
        message(sprintf('%02d ~ %02d', i, j), '\n', appendLF=FALSE)
        pred <- as.data.frame(predict(classifier, alldata[[j]][,3:cols-1]));
        alldata[[j]][[sprintf('PRED%02d', i)]] <- as.vector(pred[,1]);
    } # for (j in 1:numbers)
} # for (i in 1:numbers)
#View(alldata[[numbers]])

# Evaluate the precision, recall and F-1 score
results <- matrix(ncol=9, nrow=numbers);
colnames(results) <- c('TP', 'TN', 'FP', 'FN', 'Pcs', 'Rcl', 'Acc', 'TNR', 'F-1')

for (i in 1:numbers) {
    data <- alldata[[i]];
    tp <- 0;                                                # Cat: YES; pred: YES;
    tn <- 0;                                                # Cat: NO;  pred: NO;
    fp <- 0;                                                # Cat: NO;  pred: YES;
    fn <- 0;                                                # Cat: YES; pred: NO;
    for (j in 1:rows) {
        col <- ncol(data)
        cat <- as.character(data[j, cols])                  # Manually set label
        yes <- 0;
        no <- 0;
        for (k in (cols+1):col) {
            pred <- as.character(data[j, k])
            if (pred == 'YES')
                yes <- yes + 1;
            if (pred == 'NO')
                no <- no + 1;
        } # for (k in (cols_1):col)
        pred <- 'YES'
        if (yes < no)
            pred <- 'NO'                                    # Predicted label
        if (cat == 'YES' && pred == 'YES') {
            tp <- tp + 1;
        } else if (cat == 'NO' && pred == 'NO') {
            tn <- tn + 1;
        } else if (cat == 'NO' && pred == 'YES') {
            fp <- fp + 1;
        } else if (cat == 'YES' && pred == 'NO') {
            fn <- fn + 1;
        } # if - else
    } # for (j in 1:rows)
    precision <- tp / (tp + fp);
    recall <- tp / (tp + fn);
    accuracy <- (tp + tn) / (tp + tn + fp + fn);
    tnr <- tn / (tn + fp);
    f1 <- 2 * tp / (2 * tp + fp + fn);
    results[i, ] <- c(tp, tn, fp, fn, precision, recall, accuracy, tnr, f1)
} # for (i in 1:numbers)
View(results)
