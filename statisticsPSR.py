'''
Created on May 12, 2015

@author: Marco
'''
import os, collections, shutil
from naiveBayesClassifier import tokenizer
from naiveBayesClassifier.trainer import Trainer
from naiveBayesClassifier.classifier import Classifier


def retrieveURLs(dirctory):
    '''
    Retrieve the URLs of the 500 images
    '''
    files = os.listdir(dirctory)
    files.sort()
    urls  =[]
    for f in files:
        urls.append(f.replace('%E2', '/').replace('%3A', ':')[:-4])
    return urls
pass # def retrieveURLs(dirctory)

def countDomains(urls):
    '''
    Count the domain as well as URL distributions
    '''
    domains = {}
    for i, url in enumerate(urls):
        domain = url.replace('http://', '')
        domain = domain[:domain.index('/')]
        if domain.count('.') > 1:
            domain = domain[domain.index('.') + 1:]
        if domain.startswith('auto.'):
            domain = domain.replace('auto.', '')
        elif domain.startswith('women.'):
            domain = domain.replace('women.', '')
        elif domain.startswith('home.'):
            domain = domain.replace('home.', '')
        elif domain.startswith('esf.'):
            domain = domain.replace('esf.', '')
        elif domain.startswith('bj.'):
            domain = domain.replace('bj.', '')
        elif domain.startswith('blogosfera.'):
            domain = domain.replace('blogosfera.', '')
        elif domain.startswith('globoradio.'):
            domain = domain.replace('globoradio.', '')
        elif domain.startswith('benyouhui.'):
            domain = domain.replace('benyouhui.', '')
        elif '163.com' in domain: 
            domain = '163.com'
        elif domain == 't.qq.com':
            domain = 'qq.com'
        pages = domains.get(domain)
        if pages is None:
            domains[domain] = [(i, url)]
        else:
            pages.append((i, url))
    pass # for i, url in enumerate(urls)
    domains =  collections.OrderedDict(sorted(domains.items()))
    return domains
pass # def countDomains(urls)

def testcaseHistogram(domains):
    '''
    Generate a distribution of domains for R to draw histogram
    '''
    data = []
    index = 1
    for k in domains:
        i = 0
        while i < len(domains[k]):
            data.append(index)
            i += 1
        pass # while i < len(domains[k])
        index += 2
    pass # for k in domains
    return data
pass # def testcaseHistogram(domains)

def splitSubsets(urls, subsets):
    '''
    Split and copy the images into corresponding subsets
    '''
    root = 'E:\\databases'
    for i, subset in enumerate(subsets):
        path = '%s/subset%02d' % (root, i+1)
        if not os.path.exists(path):
            os.mkdir(path)
        for j in subset:
            url = urls[j].replace(':', '%3A').replace('/', '%E2')
            shutil.copy('%s/PNG500/%s.png' % (root, url), path)
        pass # for j in subset
    pass # for i, subset in enumerate(subsets)
pass # def splitSubsets(urls, subsets)

def retrieveResults():
    '''
    Retrieve data from the Results500.txt file
    '''
    row = []
    while len(row) < 500:
        row.append(None)
    data = []
    while len(data) < 500:
        data.append(row[:])

    f = open('E:\\databases\\Results500.txt', 'r')
    for line in f:
        if len(line.strip()) == 0:
            continue
        d = line.strip().split()
        data[int(d[0])][int(d[1])] = [float(x) for x in d[2:]]
    pass # for line in f
    f.close()
    return data
pass # def retrieveResults()

def genSubsetLabels(urls, subsets, data):
    '''
    Generate the label records for training set
    '''
    files = {}
    for i, url in enumerate(urls):
        files[url.replace(':', '%3A').replace('/', '%E2') + '.png'] = i
    subrow = []
    while len(subrow) < 50:
        subrow.append(None)
    for i, subset in enumerate(subsets):
        # Initial data matrix for each subset
        subdata = []
        while len(subdata) < 50:
            subdata.append(subrow[:])
        # Fill corresponding data into the matrix, and set the classification label to 'NO'
        for j in range(50):
            for k in range(j + 1, 50):
                subdata[j][k] = data[subset[j]][subset[k]]
                subdata[j][k].append('N0')
        pass # for - for
#         for j, sd in enumerate(subdata):
#             txt = ''
#             for k, d in enumerate(sd):
#                 txt += ('nl ' if d is None else d[-1] + ' ')
#                 if j >= k:
#                     assert d is None
#             print txt
#         pass # for sd in subdata
        # For those similar web pages, change their classification label to 'YES'
        path = 'E:\\databases\\subset%02d' % (i + 1)
        dirs = [os.path.join(path, name) for name in os.listdir(path) if os.path.isdir(os.path.join(path, name))]
        for d in dirs:
            fs = os.listdir(d)
            idxs = [files[f] for f in fs]
            idxs.sort()
            for j in range(len(idxs)):
                for k in range(j + 1, len(idxs)):
                    subdata[j][k][-1] = 'YES'
            pass # for -for
        pass # for d in dirs
        # Save the subdata to file
        f = open('%s/subset%02d-TS.txt' % (path, i + 1), 'w')
        for j in range(50):
            for k in range(j + 1, 50):
                assert subdata[j][k] is not None
                f.write('%d\t%d\t%s\n' % (j, k, subdata[j][k]))
        pass # for - for
        f.close()
    pass # for i, subset in enumerate(subsets)
pass # def genSubsetLabels(urls, subsets, data)

def classificationNB():
    for i in range(10):
        pass
    pass # for i in range(10)
# 
#     trainer = Trainer(tokenizer)
#     
#     trainset = []
pass # def classificationNB()


if __name__ == '__main__':
    urls = retrieveURLs('E:\\databases/PNG500/')
#     for i, url in enumerate(urls):
#         print i, url
#     pass # for i, url in enumerate(urls)
#     domains = countDomains(urls)
#     data = testcaseHistogram(domains)

    subsets = [[ 16,  40,  48,  49,  75,  76, 104, 105, 107, 123, \
                126, 127, 139, 141, 142, 148, 150, 156, 169, 182, \
                198, 199, 206, 223, 224, 247, 248, 269, 280, 304, \
                308, 309, 350, 351, 353, 383, 384, 399, 400, 421, \
                422, 430, 431, 448, 461, 464, 468, 474, 485, 487],          # 1
               [ 14,  50,  53,  58,  77,  78,  79, 106, 108, 109, \
                113, 146, 177, 179, 196, 197, 207, 208, 225, 226, \
                227, 228, 249, 250, 273, 288, 292, 293, 310, 311, \
                326, 332, 359, 360, 373, 374, 377, 385, 388, 391, \
                392, 402, 403, 419, 441, 454, 455, 462, 463, 465],          # 2
               [ 10,  15,  17,  27,  31,  32,  33,  80,  81,  82, \
                122, 124, 144, 145, 151, 152, 154, 164, 178, 180, \
                186, 187, 191, 200, 201, 209, 210, 229, 230, 251, \
                252, 294, 329, 330, 337, 341, 362, 363, 390, 424, \
                425, 434, 435, 440, 442, 469, 472, 480, 486, 499],          # 3
               [ 28,  83,  84,  85, 137, 147, 153, 162, 167, 168, \
                175, 183, 184, 185, 188, 192, 193, 202, 203, 211, \
                212, 231, 232, 253, 254, 274, 281, 282, 286, 290, \
                299, 302, 312, 313, 325, 342, 343, 372, 414, 426, \
                427, 429, 436, 437, 460, 467, 470, 471, 481, 488],          # 4
               [ 12,  45,  46,  56,  86,  87,  88, 159, 163, 173, \
                176, 204, 205, 233, 234, 235, 236, 255, 256, 270, \
                271, 283, 285, 291, 295, 305, 307, 314, 328, 331, \
                334, 344, 345, 361, 364, 375, 380, 393, 410, 411, \
                413, 428, 438, 439, 458, 473, 475, 482, 483, 496],          # 5
               [ 20,  36,  37,  44,  89,  90,  91, 114, 115, 165, \
                170, 190, 213, 214, 237, 238, 257, 258, 287, 289, \
                296, 297, 298, 315, 316, 317, 318, 319, 324, 352, \
                354, 356, 376, 381, 382, 409, 412, 433, 443, 444, \
                446, 449, 453, 459, 476, 477, 490, 491, 493, 498],          # 6
               [  1,   2,   3,   5,   6,  24,  34,  35,  51,  54, \
                 55,  61,  63,  64,  67,  68,  92,  93,  94, 116, \
                117, 125, 129, 149, 160, 161, 166, 215, 216, 239, \
                240, 259, 260, 275, 276, 300, 301, 306, 321, 322, \
                404, 405, 406, 423, 445, 452, 479, 492, 494, 495],          # 7
               [  4,   7,   9,  21,  22,  29,  41,  65,  66,  69, \
                 70,  95,  96,  97, 110, 111, 112, 118, 119, 128, \
                130, 131, 135, 136, 140, 143, 155, 157, 158, 181, \
                217, 218, 241, 242, 261, 262, 272, 284, 323, 333, \
                346, 347, 357, 365, 366, 387, 389, 417, 450, 484],          # 8
               [ 13,  18,  19,  23,  38,  39,  47,  71,  72,  98, \
                 99, 100, 120, 121, 133, 134, 174, 219, 220, 243, \
                244, 263, 264, 265, 266, 277, 278, 303, 320, 327, \
                336, 338, 340, 355, 367, 368, 386, 395, 396, 401, \
                407, 415, 416, 418, 432, 451, 456, 466, 489, 497],          # 9
               [  0,   8,  11,  25,  26,  30,  42,  43,  52,  57, \
                 59,  60,  62,  73,  74, 101, 102, 103, 132, 138, \
                171, 172, 189, 194, 195, 221, 222, 245, 246, 267, \
                268, 279, 335, 339, 348, 349, 358, 369, 370, 371, \
                378, 379, 394, 397, 398, 408, 420, 447, 457, 478]           # 10
              ]
#     splitSubsets(urls, subsets)

    data = retrieveResults()
    genSubsetLabels(urls, subsets, data)
pass # if __name__ == '__main__'
