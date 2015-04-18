'''
Created on Apr 16, 2015

@author: Marco
'''
from PyTree import PyTree, PyTreeNode
import re

class BlockTreeNode(PyTreeNode):
    '''
    Block tree node for PageSimilarity
    '''

    def __init__(self, **kwargs):
        '''
        Constructor: create a new block tree node
            @param kwargs:      {Dictionary} the argument dictionary
            kwargs['name']:     node name (from super class PyTreeNode)
            kwargs['left']:     (Optional, default is 0) left position of the node
            kwargs['top']:      (Optional, default is 0) left position of the node
            kwargs['width']:    (Optional, default is 0) left position of the node
            kwargs['height']:   (Optional, default is 0) left position of the node
            kwargs['info']:     (Optional, default is '') dump information of the node
        '''
        super(BlockTreeNode, self).__init__(name=kwargs.get('name'))
        self.left   = 0 if (kwargs.get('left') is None) else kwargs.get('left')
        self.top    = 0 if (kwargs.get('top') is None) else kwargs.get('top')
        self.width  = 0 if (kwargs.get('width') is None) else kwargs.get('width')
        self.height = 0 if (kwargs.get('height') is None) else kwargs.get('height')
        self.info   = '' if (kwargs.get('info') is None) else kwargs.get('info')
    pass # def __init__(self, **kwargs)

    def __str__(self):
        '''
        Return the string representation of the node
            @return:         {String} string representation of the node
        '''
        return '%s: left=%d, top=%d, width=%d, height=%d -- \'%s\'' % \
                   (self.nodeName, self.left, self.top, self.width, self.height, self.info)
    pass # def __str__(self)

pass # class BlockTreeNode(object)


class BlockTree(PyTree):
    '''
    Block tree for PageSimilarity
    '''

    @staticmethod
    def parseBlockTreeFromFile(filename):
        '''
        Create a block tree by parsing a text file
            @param filename:    {String} name of the file
            @return:            {BlockTree} the parsed block tree
        '''
        depth = 0
        curNode = None
        txts = open(filename, 'r')
        blockTree = BlockTree(name='', root=None)
        for line in txts:
            if line.startswith('=='):
                blockTree.treeName = line.split('"')[1]
                break
            pass # if line.startswith('==')
            line, info = line.strip().split('; ')
            values = re.split('\\D+', line)
            node = BlockTreeNode(name='', top=int(values[1]), left=int(values[2]), \
                                 width=int(values[3]), height=int(values[4]), info=info)
            curDepth = line.index('top') / 2
            if curDepth == 0:
                node.nodeName = '{0}'
                blockTree.root = node
            elif depth < curDepth:
                assert len(curNode.children) == 0
                node.nodeName = '{%s/00}' % curNode.nodeName[1:-1]
                curNode.append(node)
            else: # depth > curDepth
                index = depth - curDepth
                parent = curNode.parent
                while index > 0:
                    parent = parent.parent
                    index -= 1
                node.nodeName = '{%s/%02d}' % (parent.nodeName[1:-1], len(parent.children))
                parent.append(node)
            pass # if - elif - elif - else
            curNode = node
            depth = curDepth
        pass # for line in txts
        return blockTree
    pass # def parseBlockTreeFromFile(filename)

pass # class BlockTree(object)


if __name__ == '__main__':
    blockTree = BlockTree.parseBlockTreeFromFile('E:\\databases\\http%3A%E2%E2about.mama.cn%E2.txt')
    print blockTree
pass # if __name__ == '__main__'
