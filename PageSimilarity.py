'''
Created on Apr 16, 2015
@author: Marco
'''

import os, math, collections, zss, pylzma
from PIL import Image
from BlockTree import BlockTree


def PNGConverter():
    '''
    Convert all the PNG samples into JPG and BMP formats
    '''
    files = os.listdir('databases/PNG/')
    number = len(files)
    for i, f in enumerate(files):
        print '%4d/%4d\t%s' % (i, number, f)
        img = Image.open('databases/PNG/%s' % f)
        jpg = Image.new('RGB', img.size, (255, 255, 255))
        jpg.paste(img)
        jpg.save(('databases/JPG/%s' % f)[:-4] + '.jpg', 'JPEG')
        jpg.save(('databases/BMP/%s' % f)[:-4] + '.bmp', 'BMP')
    pass # for i, f in enumerate(files)
pass # def PNGConverter()

def RGBhistogram():
    '''
    Calculate and save histograms for BMP files
    '''
    def imgHisto(filename):
        img = Image.open('databases/PNG/%s.png' % filename)
        pix = img.load()
        width, height = img.size
        # Initialize the RGB matrix (256 * 256 * 256)
        rgb = []
        for i in range(256):
            g = []
            for j in range(256):
                b = []
                for k in range(256):
                    b.append(0)
                g.append(b)
            pass # for j in range(256)
            rgb.append(g)
        pass # for i in range(256)
        # save number of each specific color
        for i in range(height):
            for j in range(width):
                rgb[pix[j, i][0]][pix[j, i][1]][pix[j, i][2]] += 1

        # save color-number pairs to dictionary and sort them
        histo = {}
        for i in range(256):
            for j in range(256):
                for k in range(256):
                    if rgb[i][j][k] != 0:
                        histo['%02X%02X%02X' % (i, j, k)] = 1.0 * rgb[i][j][k]
        pass # for - for - for -if
        histo = collections.OrderedDict(sorted(histo.items(), key=lambda x: x[0]))
        # Save the data to a file
        f = open('databases/HISTO/%s.txt' % filename, 'w')
        f.write('%d, %d, %d\n' % (width, height, len(histo.keys())))
        for x in histo.keys():
            f.write('%s,%d\n' % (x, histo[x]))
        f.close()
    pass # def imgHisto(filename)

    files = os.listdir('databases/PNG/')
    number = len(files)
    for i, f in enumerate(files):
        print '%4d/%4d\t%s' % (i, number, f)
        imgHisto(f[:-4])
    pass # for i, f in enumerate(files)
pass # def RGBhistogram()

def treeEditDistance(page1, page2):
    '''
    Calculate tree edit distance between two pages' block trees
        https://github.com/timtadh/zhang-shasha/
    @param page1:     {String} the first page's file path
    @param page2:     {String} the second page's file path
    @return:         {Integer} tree edit distance
    '''
    def builupTree(root):
        tree = zss.Node(root.nodeName)
        for child in root.children:
            tree.addkid(builupTree(child))
        return tree
    pass # def builupTree(root)
    return zss.simple_distance(builupTree(BlockTree.parseBlockTreeFromFile(page1).root), \
                               builupTree(BlockTree.parseBlockTreeFromFile(page2).root))
pass # def treeEditDistance(btr1, btr2)

def histogramDistance(page1, page2):
    '''
    Calculate the distance between the two pages' color distribution histogram
        Hellinger distance:        http://en.wikipedia.org/wiki/Hellinger_distance
        Bhattacharyya distance:    http://en.wikipedia.org/wiki/Bhattacharyya_distance
        Total variation distance   http://en.wikipedia.org/wiki/Total_variation_distance_of_probability_measures
    @param page1:     {String} the first page's file path
    @param page2:     {String} the second page's file path
    @return:          {List} the above distance list
    '''
    size = 0.0
    hist = {}
    for i, line in enumerate(open(page1, 'r')):
        line = line.strip().split(',')
        if i == 0:
            size = float(line[0]) * float(line[1])
        else:
            hist[line[0]] = (float(line[1]) / size, 0.0)
    pass # for i, line in enumerate(open(page1, 'r'))
    for i, line in enumerate(open(page2, 'r')):
        line = line.strip().split(',')
        if i == 0:
            size = float(line[0]) * float(line[1])
        else:
            hist[line[0]] = (0.0, float(line[1]) / size) if hist.get(line[0]) is None else \
                            (hist[line[0]][0], float(line[1]) / size)
    pass # for i, line in enumerate(open(page1, 'r'))
    #hist = collections.OrderedDict(sorted(hist.items(), key=lambda x: x[0]))

    hellingerDistance = 0.0
    bhattacharyyaDistance = 0.0
    totalVariationDistance = 0.0
    for x, y in hist.values():
        hellingerDistance += (x ** 0.5 - y ** 0.5) ** 2
        bhattacharyyaDistance += (x * y) ** 0.5
        if totalVariationDistance < math.fabs(x - y):
            totalVariationDistance = math.fabs(x - y)
    pass # for x, y in hist
    hellingerDistance = (hellingerDistance / 2.0) ** 0.5
    bhattacharyyaDistance = -math.log(bhattacharyyaDistance)

    return [hellingerDistance, bhattacharyyaDistance, totalVariationDistance]
pass # def histogramDistance(page1, page2)

def fileNCD(page1, page2):
    '''
    Calculate normalized compression distance between two pages
        http://www.complearn.org/ncd.html
    @param page1:     {String} the first page's file path
    @param page2:     {String} the second page's file path
    @return:          {Float} NCD value
    '''
    data1, data2 = open(page1, 'rb').read(), open(page2, 'rb').read()
    len1, len2 = len(pylzma.compress(data1)), len(pylzma.compress(data2))
    return 1.0 * (len(pylzma.compress(data1 + data2)) - min(len1, len2)) / max(len1, len2)
pass # def fileNCD(page1, page2)

def fileStatistics():
    '''
    Check and save all images' statistics
    '''
    files = os.listdir('databases/PNG/')
    fw = open('databases/fileStatistics.txt', 'w')
    number = len(files)
    fw.write('fileSize  compSize  URL\n')
    for i, f in enumerate(files):
        print '%4d/%4d\t%s' % (i, number, f)
        statinfo = os.stat('databases/PNG/%s' % f)
        fw.write('%-9d %-9d %s\n' % (statinfo.st_size, \
                                     len(pylzma.compress(open('databases/PNG/%s' % f, 'rb').read())), \
                                     f.replace('%E2', '/').replace('%3A', ':')[:-4]))
    pass # for i, f in enumerate(files)
    fw.close()
pass # def fileStatistics()

def pageSimilarity(btr1, btr2):
    if page1 is None or len(page1) == 0 or page2 is None or len(page2) == 0:
        return -1.0
    img1, img2 = Image.open('databases/%s.png' % page1), Image.open('databases/%s.png' % page2)
    print img1.size, img2.size
    btr1 = BlockTree.parseBlockTreeFromFile('databases/%s.txt' % page1)
    btr2 = BlockTree.parseBlockTreeFromFile('databases/%s.txt' % page2)
    bnode1, bnode2 = btr1.root, btr2.root
    block1 = img1.crop((bnode1.left, bnode1.top, bnode1.right, bnode1.bottom))
    block2 = img2.crop((bnode2.left, bnode2.top, bnode2.right, bnode2.bottom))
    print block1.size, block2.size

    ps = 0.0
    # TODO: calculate page similarity
    
    return ps
pass # def pageSimilarity(btr1, btr2)


if __name__ == '__main__':
    # Convert the samples
    #PNGConverter()
    # Calculate color histograms
    #RGBhistogram()
    # File statistics: file size, compressed size and file name (URL)
    #fileStatistics()

    page1 = 'http%3A%E2%E2finance.ifeng.com%E2intellect%E2'
    page2 = 'http%3A%E2%E2www.gome.com.cn%E2category%E2cat10000053.htm'

    #print fileNCD('databases/PNG/%s.png' % page1, 'databases/PNG/%s.png' % page2)
    #print treeEditDistance('databases/TXT/%s.txt' % page1, 'databases/TXT/%s.txt' % page2)
    #print histogramDistance('databases/HISTO/%s.txt' % page1, 'databases/HISTO/%s.txt' % page2)

pass # if __name__ == '__main__'
