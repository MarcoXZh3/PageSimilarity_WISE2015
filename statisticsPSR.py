'''
Created on May 12, 2015

@author: Marco
'''
import os, collections, shutil


def retrieveURLs(dirctory):
    files = os.listdir(dirctory)
    files.sort()
    urls  =[]
    for f in files:
        urls.append(f.replace('%E2', '/').replace('%3A', ':')[:-4])
    return urls
pass # def retrieveURLs(dirctory)

def countDomains(urls):
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
    root = 'E:\\databases'
    for i, subset in enumerate(subsets):
        path = '%s/subset%02d' % (root, i+1)
        if not os.path.exists(path):
            os.mkdir(path)
        path += '/PNG'
        if not os.path.exists(path):
            os.mkdir(path)
        for j in subset:
            url = urls[j].replace(':', '%3A').replace('/', '%E2')
            shutil.copy('%s/PNG500/%s.png' % (root, url), path[:-4])
        pass # for j in subset
        print i
    pass # for i, subset in enumerate(subsets)
pass # def splitSubsets(urls, subsets)


if __name__ == '__main__':
    urls = retrieveURLs('E:\\databases/PNG500/')
#     for i, url in enumerate(urls):
#         print i, url
#     pass # for i, url in enumerate(urls)
    domains = countDomains(urls)
    data = testcaseHistogram(domains)
    subsets = [[ 48,  49, 148, 269, 142, 169, 468, 487, 198, 199, \
                139, 206, 223, 224, 247, 248, 156, 150, 474,  40, \
                107, 308, 309, 485, 350, 461, 399, 400, 280, 351, \
                421, 422, 448, 464, 123, 182,  16, 304,  75,  76, \
                104, 105, 383, 384, 430, 431, 141, 353, 126, 127],          # 1
               [ 58, 113, 385, 441, 177, 179,  14, 196, 197, 207, \
                208, 225, 226, 227, 228, 249, 250, 273, 288, 108, \
                109, 310, 311, 377, 462, 463, 419, 373, 392,  50, \
                332, 465, 454, 455, 292, 293, 374,  77,  78,  79, \
                106, 391, 402, 403, 146, 388, 359, 360,  53, 326],          # 2
               [122, 124, 442, 469, 180, 191,  15, 200, 201, 209, \
                210, 229, 230, 251, 252, 144, 145, 337, 390, 151, \
                152, 154, 341, 434, 435, 440, 499, 178, 186, 187, \
                294, 480, 486,  80,  81,  82,  17,  31,  32,  33, \
                329, 330, 472,  10,  27, 362, 363, 424, 425, 164],          # 3
               [147, 282, 470, 471, 274, 281, 183, 488, 202, 203, \
                211, 212, 231, 232, 253, 254, 167, 460, 153, 290, \
                312, 313, 342, 343, 436, 437, 192, 193, 184, 185, \
                188, 481, 162, 426, 427,  83,  84,  85, 137, 175, \
                 28, 325, 414, 429, 299, 302, 286, 467, 372, 168],          # 4
               [295, 411, 473, 475, 285, 314,  12,  56, 204, 205, \
                233, 234, 235, 236, 255, 256, 173, 305, 291, 307, \
                344, 345, 482, 483, 438, 439, 271, 393, 334, 283, \
                413, 270, 159, 428, 458,  86,  87,  88, 176, 328, \
                375, 380, 163, 331, 361, 364, 496,  45, 410,  46],          # 5
               [412, 444, 476, 477, 315, 316,  20, 324, 296, 297, \
                213, 214, 237, 238, 257, 258, 190, 289, 298, 409, \
                446, 490, 491, 453, 493, 498, 114, 115, 356, 317, \
                318, 170, 287,  89,  90,  91,  36,  37, 352, 381, \
                382, 443, 449,  44, 165, 433, 319, 459, 354, 376],          # 6
               [445,   1,   2,   3,   5,   6, 321, 322,  54,  55, \
                 63,  64, 215, 216, 239, 240, 259, 260, 149, 404, \
                 61, 479, 306, 492, 494, 495, 452, 405, 406, 116, \
                117, 275, 276,  24, 160, 161,  67,  68,  92,  93, \
                 94,  34,  35, 125,  51, 129, 166, 423, 300, 301],          # 7
               [110, 111,   4, 140,   7, 323, 333,  21,  22,  41, \
                 65,  66, 217, 218, 241, 242, 261, 262, 484, 112, \
                284, 346, 347, 272, 389, 143, 181, 155, 417, 118, \
                119, 157, 158,   9,  29,  69,  70,  95,  96,  97, \
                135, 136, 130, 131, 387, 450, 365, 366, 128, 357],          # 8
               [ 38,  39, 338, 386,  13,  23, 355, 401,  47, 456, \
                416, 219, 220, 243, 244, 263, 264, 265, 266, 327, \
                451, 395, 396,  18,  19, 418, 120, 121, 489, 497, \
                277, 278, 174,  71,  72,  98,  99, 100, 133, 134, \
                415, 466, 336, 340, 367, 368, 407, 320, 303, 432],          # 9
               [ 59,  60,  26,  52, 408, 457, 194, 195, 171, 172, \
                 57, 138, 221, 222, 245, 246, 267, 268, 378, 379, \
                348, 349, 397, 398,  25, 279,   8, 420, 339, 447, \
                189,  30,  73,  74, 101, 102, 103,  43, 132,  62, \
                335, 394, 478, 369, 370,  42, 358, 371,   0,  11]           # 10
              ]
    splitSubsets(urls, subsets)
pass # if __name__ == '__main__'
