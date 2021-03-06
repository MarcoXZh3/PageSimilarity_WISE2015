'''
Created on Apr 16, 2015
@author: Marco
'''

import os, math, random, string, collections, re, base64, zss, pylzma
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

def simLay(page1, page2, level):
    if level <= 0:
        return
    # Load the two images
    img = Image.open(page1)
    img1 = Image.new('RGB', (1024, 1024), '#FFF')
    img1.paste(img, ((1024 - img.size[0]) / 2, 0))
    #img1.show()
    img = Image.open(page2)
    img2 = Image.new('RGB', (1024, 1024), '#FFF')
    img2.paste(img, ((1024 - img.size[0]) / 2, 0))
    #img2.show()

    # Calculation
    v = []
    for i in range(level):
        width = 1024 / (2 ** i)
        value = 0.0
        for j in range(2 ** i):
            for k in range(2 ** i):
#                 count1, count2 = set(), set()
                c = 0
                pix1 = img1.crop((k * width, j * width, (k + 1) * width, (j + 1) * width)).load()
                pix2 = img2.crop((k * width, j * width, (k + 1) * width, (j + 1) * width)).load()
                for m in range(width):
                    for n in range(width):
                        if pix1[m, n] == pix2[m, n]:
                            c += 1
#                         count1.add(pix1[m, n])
#                         count2.add(pix2[m, n])
                pass # for -for
                value += 1.0 * c#min(len(count1), len(count2))
        pass # for - for
        v.append(value)
    pass # for i in range(level)

    re = v[-1]
    for i in range(level - 1):
        re += (v[i] - v[i + 1]) / (2.0 ** (level - i))
    return re
pass # def simLay(page1, page2)

def pageSimilarity(page1, page2):
    '''
    Similar to treeEditDistance
    Calculate page similarity between two pages' block trees
        https://github.com/timtadh/zhang-shasha/
    @param page1:     {String} the first page's file path
    @param page2:     {String} the second page's file path
    @return:         {Integer} page similarity
    '''
    def builupTree(root):
        tree = zss.Node(root.info)
        for child in root.children:
            tree.addkid(builupTree(child))
        return tree
    pass # def builupTree(root)
    insert_cost = lambda node: 1
    remove_cost = lambda node: 1
    update_cost = lambda a, b: 1
    return zss.distance(builupTree(BlockTree.parseBlockTreeFromFile(page1).root), \
                        builupTree(BlockTree.parseBlockTreeFromFile(page2).root), \
                        zss.Node.get_children, insert_cost, remove_cost, update_cost)
pass # def pageSimilarity(btr1, btr2)

def readData(files):
    '''
    Read necessary data
    @param files:    {List} file list
    @return:         {List} data list
    '''
    def builupTree(root):
        tree = zss.Node(root.nodeName)
        for child in root.children:
            tree.addkid(builupTree(child))
        return tree
    pass # def builupTree(root)

    number = len(files)
    data = []
    for i, f in enumerate(files):
        d = {}
        #d['url'] = f
        d['img'] = Image.open('databases/PNG/%s.png' % f)
        d['byte'] = open('databases/PNG/%s.png' % f, 'rb').read()
        d['clen'] = len(pylzma.compress(d['byte']))
        d['btree'] = BlockTree.parseBlockTreeFromFile('databases/TXT/%s.txt' % f)
        d['etree'] = builupTree(d['btree'].root)
        hist = {}
        size = 0.0
        for j, line in enumerate(open('databases/HISTO/%s.txt' % f, 'r')):
            line = line.strip().split(',')
            if j == 0:
                size = float(line[0]) * float(line[1])
            else:
                hist[line[0]] = float(line[1]) / size
        pass # for j, line in enumerate(open('databases/HISTO/%s.txt' % f, 'r'))
        d['hist'] = hist
        print 'Reading data: %4d / %4d' % (i, number)
        data.append(d)
    pass # for i, f in enumerate(files)
    return data
pass # def readData(files)

def process(files, data):
    '''
    Process the data
    @param files:    {List} file list
    @param data:     {List} data list
    '''
    number = len(files)
    fResult = open('databases/results.txt', 'w')
    for i in range(number):
        for j in range(i + 1, number):
            step = {}

            # Calculate NCD
            clen1, clen2 = data[i]['clen'], data[j]['clen']
            step['ncd'] = 1.0 * (len(pylzma.compress(data[i]['byte'] + data[j]['byte'])) - min(clen1, clen2)) \
                              / max(clen1, clen2)

            # Calculate tree edit distance
            step['ted'] = zss.simple_distance(data[i]['etree'], data[j]['etree'])

            # Calculate color histogram distances
            hellingerDistance = 0.0
            bhattacharyyaDistance = 0.0
            totalVariationDistance = 0.0
            colors = list(set(data[i]['hist'].keys() + data[j]['hist'].keys()))
            for c in colors:
                count1, count2 = data[i]['hist'].get(c), data[j]['hist'].get(c)
                if count1 is None:  count1 = 0.0
                if count2 is None:  count2 = 0.0
                hellingerDistance += (count1 ** 0.5 - count2 ** 0.5) ** 2
                bhattacharyyaDistance += (count1 * count2) ** 0.5
                if totalVariationDistance < math.fabs(count1 - count2):
                    totalVariationDistance = math.fabs(count1 - count2)
            pass # for c in colors
            hellingerDistance = (hellingerDistance / 2.0) ** 0.5
            bhattacharyyaDistance = -math.log(bhattacharyyaDistance)
            step['hist'] = [hellingerDistance, bhattacharyyaDistance, totalVariationDistance]

            # Write down results
            print 'Calculating: %4d, %4d / %4d' % (i, j, number)
            fResult.write('%4d,%4d:%s\n' % (i, j, step))
    pass # for - for
    fResult.close()
pass # def process(files, data)

def updateBlockTree1():
    '''
    Update the block tree TXT file
    set info to NCD between the render block and white image with same size
    '''
    pngs, btrs = os.listdir('databases/PNG/'), os.listdir('databases/BTREE/')
    pngs.sort()
    btrs.sort()
    number = len(btrs)
    assert number == len(pngs)
    for i, btr in enumerate(btrs):
        print '%4d/%4d %s' % (i, number, btr)
        lines = []
        f = open('databases/BTREE/%s' % btr, 'r')
        for line in f:
            if len(line.strip()) != 0:
                lines.append(line.split('; ')[0])
        f.close()
        img0 = Image.open('databases/PNG/%s.png' % btr[:-4])
        f = open('databases/BTREE/%s' % btr, 'w')
        for line in lines:
            if line.startswith('================'):
                f.write('%s\n' % line)
                continue
            pass # if line.startswith('================')
            ncd = ''
            try:
                top, left, right, bottom = [int(x) for x in re.split('\D+', line)[1:]]
                img0.crop((left, top, right, bottom)).save('databases/tmp-img1.png')
                Image.new('RGB', (right - left, bottom - top), '#FFF').save('databases/tmp-img2.png')
                ncd = '%f' % fileNCD('databases/tmp-img1.png', 'databases/tmp-img2.png')
            except:
                ncd = ''.join(random.SystemRandom().choice(string.uppercase + string.lowercase + string.digits) \
                                                            for _ in xrange(32))
                pass
            pass # try - except
            f.write('%s; %s\n' % (line, ncd))
        f.close()
        pass # for line in lines
    pass # for i, btr in enumerate(btrs)
pass # def updateBlockTree1()

def updateBlockTree2():
    '''
    Update the block tree TXT file
    set info to base64 string of the render block image
    '''
    pngs, btrs = os.listdir('databases/PNG/'), os.listdir('databases/BTREE/')
    pngs.sort()
    btrs.sort()
    number = len(btrs)
    assert number == len(pngs)
    for i, btr in enumerate(btrs):
        print '%4d/%4d %s' % (i, number, btr)
        lines = []
        f = open('databases/BTREE/%s' % btr, 'r')
        for line in f:
            lines.append(line.split('; ')[0])
        f.close()
        img = Image.open('databases/PNG/%s.png' % btr[:-4])
        f = open('databases/BTREE/%s' % btr, 'w')
        for line in lines:
            if line.startswith('================'):
                f.write('%s\n' % line)
                continue
            pass # if line.startswith('================')
            txt = ''
            try:
                top, left, right, bottom = [int(x) for x in re.split('\D+', line)[1:]]
                img.crop((left, top, right, bottom)).save('databases/tmp-img.png')
                txt = base64.b64encode(open('databases/tmp-img.png', 'rb').read())
            except:
                txt = ''.join(random.SystemRandom().choice(string.uppercase + string.lowercase + string.digits) \
                                                            for _ in xrange(32))
            pass # try - except
            f.write('%s; \'%s\'\n' % (line, txt))
        f.close()
        pass # for line in lines
    pass # for i, btr in enumerate(btrs)
pass # def updateBlockTree2()


if __name__ == '__main__':
    # Convert the samples
    #PNGConverter()
    # Calculate color histograms
    #RGBhistogram()
    # File statistics: file size, compressed size and file name (URL)
    #fileStatistics()
    # Update Block Trees, set info to NCD
    #updateBlockTree1()
    # Update Block Trees, set info to base64
    #updateBlockTree2()

    for idx in range(10):
        files = os.listdir('databases/subset%02d/' % (idx + 1))
        files.sort()
        files = [f[:-4] for f in files]
        number = len(files)
        fResult = open('databases/subset%02d/results-PageSimNCD-%02d.txt' % (idx+1, idx+1), 'w')
        for i, f in enumerate(files):
            for j in range(i + 1, number):
                step = {}
    #             # First run: calculate NCD, TED and HISTOs
    #             step['ncd'] = fileNCD('databases/PNG/%s.png' % f, 'databases/PNG/%s.png' % files[j])
    #             step['ted'] = treeEditDistance('databases/TXT/%s.txt' % f, 'databases/TXT/%s.txt' % files[j])
    #             step['hist'] = histogramDistance('databases/HISTO/%s.txt' % f, 'databases/HISTO/%s.txt' % files[j])
    #             # Second run: calculate SimLay only
    #             step['simlay'] = simLay('databases/PNG/%s.png' % f, 'databases/PNG/%s.png' % files[j], 4)
                # Third run: calculate PageSimilarity
    #             step['pageSim-base64'] = pageSimilarity('databases/BTREE-BASE64/%s.txt' % f, \
    #                                                     'databases/BTREE-BASE64/%s.txt' % files[j])
                step['pageSim-ncd'] = pageSimilarity('databases/BTREE-NCD/%s.txt' % f, \
                                                     'databases/BTREE-NCD/%s.txt' % files[j])
                print '%4d, %4d / %4d - %2d' % (i, j, number, idx)
                fResult.write('%d,%d:%s\n' % (i, j, step))
        pass # for - for
        fResult.close()
    pass # for idx in range(10)
pass # if __name__ == '__main__'
