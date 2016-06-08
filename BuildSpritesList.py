#!/usr/bin/python
# -*- coding: utf-8 -*-

import argparse
import os
import base64
import json
import struct
import imghdr
from os import walk

#
# http://stackoverflow.com/a/20380514
#
def get_image_size(fname, fhandle):
    '''Determine the image type of fhandle and return its size.
    from draco'''
    #with open(fname, 'rb') as fhandle:
    head = fhandle.read(24)
    if len(head) != 24:
        return
    if imghdr.what(fname) == 'png':
        check = struct.unpack('>i', head[4:8])[0]
        if check != 0x0d0a1a0a:
            return
        width, height = struct.unpack('>ii', head[16:24])
    elif imghdr.what(fname) == 'gif':
        width, height = struct.unpack('<HH', head[6:10])
    elif imghdr.what(fname) == 'jpeg':
        try:
            fhandle.seek(0) # Read 0xff next
            size = 2
            ftype = 0
            while not 0xc0 <= ftype <= 0xcf:
                fhandle.seek(size, 1)
                byte = fhandle.read(1)
                while ord(byte) == 0xff:
                    byte = fhandle.read(1)
                ftype = ord(byte)
                size = struct.unpack('>H', fhandle.read(2))[0] - 2
            # We are at a SOFn block
            fhandle.seek(1, 1)  # Skip `precision' byte.
            height, width = struct.unpack('>HH', fhandle.read(4))
        except Exception: #IGNORE:W0703
            return
    else:
        return
    return width, height


def generateBaseOutput(join, prefix, isNewIcons):
    imgToRead = open(join, 'rb')
    base64 = imgToRead.read().encode('base64')
    imgToRead.close()
    size = get_image_size(join, open(join, 'rb'))
    if size != None:
        join = join.replace('/', '-')
        join = join.replace('\\', '-')
        if prefix == 'retina':
            join = join.replace('core-image-retina', '.coveo', 1)
        else:
            join = join.replace('core-image', '.coveo', 1)

        if isNewIcons == 'false':
            join = join.replace('core-breakingchanges-redesignlightning-image', '.coveo', 1)

        cssClass = join.replace('.png', '')
        #base64 = imgToRead.read().encode('base64')
        return (cssClass, {'img': base64,
                'size': size[0] * size[1],
                'name': cssClass[1:]})
    else:
        return

def generateOutputHTML(baseOutput):

    output = '<tr>'
    output += "<td style='border:1px solid #cccccc;'>" + baseOutput[0] \
        + '</td>'
    output += \
        '<td style=\'border:1px solid #cccccc;\'><img src="data:image/png;base64,' \
        + baseOutput[1]['img'] + '" /></td>'
    output += '</tr>'

    return output


if __name__ == '__main__':
    optionsParser = \
        argparse.ArgumentParser(description='Build human readable list of sprites and their css class'
                                )

    optionsParser.add_argument('--sprites', action='store',
                               help='Sprites directory')

    optionsParser.add_argument('--out', action='store',
                               help='Output directory')

    optionsParser.add_argument('--isNew', action='store',
                               help='Is new sprites')

    args = optionsParser.parse_args()
    index = args.sprites.find('retina')
    prefix = 'normal'
    if index != -1:
        prefix = 'retina'
    print 'Generating sprites list for ' + args.sprites
    outputHTML = "<!HTML><table style='text-align: center;'>"
    outputJson = []
    for (dir, subdirs, filesnames) in os.walk(args.sprites):
        for filename in filesnames:
            join = os.path.join(dir, filename)
            baseOutput = generateBaseOutput(join, prefix, args.isNew)
            if baseOutput != None:
                outputJson.append(baseOutput)
                outputHTML += generateOutputHTML(baseOutput)


    outputHTML += '</table></HTML>'
    outFile = open(os.path.join(args.out, prefix + '-icon-list' + ('',
                   '-new')[args.isNew == 'true'] + '.html'), 'w')
    outFile.write(outputHTML)
    outFile = open(os.path.join(args.out, prefix + '-icon-list' + ('',
                   '-new')[args.isNew == 'true'] + '.json'), 'w')
    outFile.write(json.dumps(dict(outputJson)))


			