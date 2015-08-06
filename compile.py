from worker import worker, compressor
from subprocess import call

worker.get_data()
compressor.compress_data()

call(['mv', 'compressed.js', '/data/static/data.js'])
call(['rm', 'all.json'])
