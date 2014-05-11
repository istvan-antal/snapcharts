SnapCharts.TimeSeriesChart = function (options) {
    var svg, chart;

    this._yStep = 1;
    this._xStep = 86400000 * 100; //24*7 hours

    this._x1 = 0;
    this._x2 = 900;
    this._y1 = 0;
    this._y2 = 500;

    this._width = this._x2 - this._x1;
    this._height = this._y2 - this._y1;

    this._avgSize = (this._width + this._height) / 2;

    this._values = null;

    this._root = $(options.root);
    svg = $(options.root);
    svg.html('<svg viewbox="' +
        this._x1 + ' ' + this._y1 + ' ' + this._x2 + ' ' + this._y2 +
        '"></svg>');

    chart = new Snap(svg.find('svg')[0]);

    this._chart = chart;
    this._processValues();
    this._buildAxis();

    this._drawAxisMarkers();

    this._plotData();
};

SnapCharts.TimeSeriesChart.prototype = {
    _drawAxisMarkers: function () {
        var i,
            ty,
            tx;

        for (i = this._minY; i <= this._maxY; i += this._yStep) {
            ty = this._y2 - this._translateToAxisPoint('y', i);
            this._chart.line(this._yAxisX - this._width * 0.018, ty, this._yAxisX, ty).attr({
                class: 'grid-line-marker',
                stroke: '#000',
                strokeWidth: this._width * 0.003
            });
            this._chart.text(this._yAxisX - this._width * 0.04,
                ty + this._height * 0.009, String(i)).attr({
                'font-size': (this._width + this._height) / 2 * 0.03
            });
        }

        for (i = this._minX; i <= this._maxX; i += this._xStep) {
            tx = this._translateToAxisPoint('x', i);
            this._chart.line(tx, this._xAxisY, tx, this._xAxisY + this._height * 0.018).attr({
                class: 'grid-line-marker',
                stroke: '#000',
                strokeWidth: this._width * 0.003
            });
            this._chart.text(tx - this._width * 0.004,
                this._xAxisY + (this._width + this._height) / 2 * 0.035,
                this._formatTimeStamp(i)).attr({
                'font-size': (this._width + this._height) / 2 * 0.03
            });
        }
    },
    _formatTimeStamp: function (timeStamp) {
        var d = new Date(timeStamp),
            string = '';

        string += d.getUTCFullYear();
        string += '/';
        string += (d.getUTCMonth() + 1);
        string += '/';
        string += d.getUTCDate();

        return string;
    },
    _plotData: function () {
        var self = this,
            path = '';

        this._values.forEach(function (series) {
            series.values.forEach(function (value) {
                var point = {
                    x: self._translateToAxisPoint('x', value.time),
                    y: self._y2 - self._translateToAxisPoint('y', value.value)
                };

                if (path) {
                    path += 'L';
                } else {
                    path += 'M';
                }

                path += String(point.x + ',' + point.y + ' ');

                self._chart.circle(point.x, point.y, self._avgSize * 0.012).attr({
                    fill: '#F06969'
                }).hover(function () {
                    this.animate({ r: self._avgSize * 0.018 }, 150);
                }, function () {
                    this.animate({ r: self._avgSize * 0.012 }, 150);
                });
            });
        });

        this._chart.path(path).attr({
            stroke: '#F06969',
            "fill-opacity": 0,
            strokeWidth: self._width * 0.003
        });
    },
    _buildAxis: function () {
        this._xAxisStart = this._width * 0.05;
        this._xAxisEnd = this._width * 0.95;

        this._yAxisStart = this._height * 0.05;
        this._yAxisEnd = this._height * 0.95;

        this._xAxisY = this._height * 0.95;
        this._yAxisX = this._width * 0.05;

        this._xAxisLine = this._chart.
            line(this._xAxisStart, this._xAxisY, this._xAxisEnd, this._xAxisY).
            attr({
                stroke: '#000',
                strokeWidth: this._width * 0.003
            });

        this._chart.
            line(this._yAxisX, this._yAxisStart, this._yAxisX, this._yAxisEnd).
            attr({
                stroke: '#000',
                strokeWidth: this._width * 0.003
            });
    },
    _translateToAxisPoint: function (axis, value) {
        return ((value - this['_min' + axis.toUpperCase()]) /
                (this['_max' + axis.toUpperCase()] - this['_min' + axis.toUpperCase()])) *
                (this['_' + axis + 'AxisEnd'] - this['_' + axis + 'AxisStart'])  +
                this['_' + axis + 'AxisStart'];
    },
    _processValues: function () {
        this._values = this._root.data('values');

        var firstValue = this._values[0].values[0];

        var minX = firstValue.time;
        var maxX = minX;

        var minY = firstValue.value;
        var maxY = minY;

        this._values.forEach(function (series) {
            series.values.forEach(function (value) {
                if (value.time < minX) {
                    minX = value.time;
                }

                if (value.time > maxX) {
                    maxX = value.time;
                }

                if (value.value < minY) {
                    minY = value.value;
                }

                if (value.value > maxY) {
                    maxY = value.value;
                }
            });
        });

        //auto expand range;
        if (minY > 0) {
            minY = 0;
        }

        if (minX === maxX) {
            minX -= maxX;
        }

        this._minX = minX;
        this._maxX = maxX;

        this._minY = minY;
        this._maxY = maxY;

    }
};