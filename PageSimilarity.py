'''
Created on Apr 16, 2015

@author: Marco
'''

from PIL import Image
from BlockTree import BlockTree

def pageSimilarity(page1, page2):
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
pass # def pageSimilarity(page1, page2)

if __name__ == '__main__':
    page1 = 'http%3A%E2%E2finance.ifeng.com%E2intellect%E2'
    page2 = 'http%3A%E2%E2www.gome.com.cn%E2category%E2cat10000053.htm'
    print pageSimilarity(page1, page2)
pass # if __name__ == '__main__'
