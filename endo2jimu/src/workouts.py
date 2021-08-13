#!/usr/bin/env python3
import report as report
import etl.extract as extract
import etl.transform as trasform 
import etl.load as load

print('***** START *****')

report.do()

stage = []
extract.do(stage)
trasform.do(stage)
load.do(stage)

print('***** END *****')