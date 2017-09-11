import { DeviceUtils } from '../../src/utils/DeviceUtils';

export function DeviceUtilsTest() {
  describe('DeviceUtils', () => {
    it('should detect Edge', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (Windows NT 10.0; <64-bit tags>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Safari/<WebKit Rev> Edge/<EdgeHTML Rev>.<Windows Build>'
        )
      ).toEqual('Edge');
    });

    it('should detect Chrome', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36'
        )
      ).toEqual('Chrome');
    });

    it('should detect Firefox', () => {
      expect(DeviceUtils.getDeviceName('Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:53.0) Gecko/20100101 Firefox/53.0"')).toEqual(
        'Firefox'
      );
    });

    it('should detect Android', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (Linux; <Android Version>; <Build Tag etc.>) AppleWebKit/<WebKit Rev> (KHTML, like Gecko) Chrome/<Chrome Rev> Mobile Safari/<WebKit Rev>'
        )
      ).toEqual('Android');
    });

    it('should detect BlackBerry', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.1.0.346 Mobile Safari/534.11+'
        )
      ).toEqual('BlackBerry');
    });

    it('should detect iPhone', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        )
      ).toEqual('iPhone');
    });

    it('should detect iPad', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25'
        )
      ).toEqual('iPad');
    });

    it('should detect Opera Mini', () => {
      expect(
        DeviceUtils.getDeviceName('User-Agent: Opera/9.80 (Android; Opera Mini/8.0.1807/36.1609; U; en) Presto/2.12.423 Version/12.16')
      ).toEqual('Opera Mini');
    });

    it('should detect IE', () => {
      expect(DeviceUtils.getDeviceName('User-Agent: Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko')).toEqual('IE');
    });

    it('should detect Opera', () => {
      expect(DeviceUtils.getDeviceName('Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16')).toEqual('Opera');
    });

    it('should detect Firefox', () => {
      expect(DeviceUtils.getDeviceName('Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:10.0) Gecko/20100101 Firefox/10.0')).toEqual(
        'Firefox'
      );
    });

    it('should detect Safari', () => {
      expect(
        DeviceUtils.getDeviceName(
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A'
        )
      ).toEqual('Safari');
    });

    it('should fallback on "other" when it does not find anything', () => {
      expect(DeviceUtils.getDeviceName('weird stuff')).toEqual('Others');
    });
  });
}
