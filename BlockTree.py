'''
Created on Apr 21, 2015

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
            kwargs['top']:      (Optional, default is 0) top position of the node
            kwargs['right']:    (Optional, default is 0) right position of the node
            kwargs['bottom']:   (Optional, default is 0) bottom position of the node
            kwargs['info']:     (Optional, default is '') dump information of the node
        '''
        super(BlockTreeNode, self).__init__(name=kwargs.get('name'))
        self.left   = 0 if (kwargs.get('left') is None) else kwargs.get('left')
        self.top    = 0 if (kwargs.get('top') is None) else kwargs.get('top')
        self.right  = 0 if (kwargs.get('right') is None) else kwargs.get('right')
        self.bottom = 0 if (kwargs.get('bottom') is None) else kwargs.get('bottom')
        self.info   = '' if (kwargs.get('info') is None) else kwargs.get('info')
    pass # def __init__(self, **kwargs)

    def __str__(self):
        '''
        Return the string representation of the node
            @return:         {String} string representation of the node
        '''
        return '%s: left=%d, top=%d, right=%d, bottom=%d -- \'%s\'' % \
                   (self.nodeName, self.left, self.top, self.right, self.bottom, self.info)
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
            if len(line.strip()) == 0:
                continue
            if line.startswith('=='):
                blockTree.treeName = line.split('"')[1]
                break
            pass # if line.startswith('==')
            line, info = line.strip().split('; ')
            values = re.split('\\D+', line)
            node = BlockTreeNode(name='', top=int(values[1]), left=int(values[2]), \
                                 right=int(values[3]), bottom=int(values[4]), info=info)
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

#print BlockTree.parseBlockTreeFromFile('databases/http%3A%E2%E24travel.jp%E2.txt')

# Text file looks like:
#   top=0,left=0,right=1920,bottom=0; /0
#   |-top=-9999,left=-9999,right=1920,bottom=976; /0/{DIV,SPAN,SPAN}
#   | |-top=259,left=259,right=1815,bottom=718; /0/{DIV,SPAN,SPAN}/{DIV}
#   | | |-top=299,left=299,right=1014,bottom=677; /0/{DIV,SPAN,SPAN}/{DIV}/{DIV}
#   | | | |-top=299,left=409,right=1014,bottom=660; /0/{DIV,SPAN,SPAN}/{DIV}/{DIV}/{P,P,DIV}
#   | | | | |-top=409,left=585,right=1014,bottom=661; /0/{DIV,SPAN,SPAN}/{DIV}/{DIV}/{P,P,DIV}/{H1,P,UL}
#   | | | | | |-top=585,left=642,right=1014,bottom=661; /0/{DIV,SPAN,SPAN}/{DIV}/{...
# ================ BlockTree: "http://www.abs-cbnnews.com/video/lifestyle/03/27/15/loop-beauty-and-president" ====...
