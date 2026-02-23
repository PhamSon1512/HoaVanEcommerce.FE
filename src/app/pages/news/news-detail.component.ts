import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: Date;
  category: string;
  author: string;
  tags: string[];
};

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [DatePipe, NgIf, NgFor],
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit, OnDestroy {
  newsItem: NewsItem | null = null;
  relatedNews: NewsItem[] = [];

  currentRelatedIndex = 0;

  private routeSubscription?: Subscription;
  private sliderIntervalId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(() => {
      this.loadNewsDetail();
    });
  }

  ngOnDestroy() {
    this.routeSubscription?.unsubscribe();
    this.stopAutoSlide();
  }

  private loadNewsDetail() {
    const newsId = this.route.snapshot.paramMap.get('id');

    const allNews = this.getAllNews();
    this.newsItem = allNews.find(n => n.id === newsId) || null;

    if (!this.newsItem) {
      this.router.navigate(['/tin-tuc']);
      return;
    }

    this.relatedNews = allNews.filter(n => n.id !== this.newsItem!.id).slice(0, 3);
    this.currentRelatedIndex = 0;
    this.startAutoSlide();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private getAllNews(): NewsItem[] {
    return [
      {
        id: 'thanh-toa-viet-nam-va-trung-hoa',
        title: 'Thần thoại Việt Nam và thần thoại Trung Hoa',
        excerpt:
          'Thần thoại không chỉ là những câu chuyện cổ xưa mà còn là kho tàng biểu tượng văn hóa phong phú, đặc biệt là nguồn cảm hứng lớn cho việc tái thiết kế hoa văn truyền thống Việt Nam và Trung Hoa.',
        content: `
          <p>Thần thoại không chỉ là những câu chuyện cổ xưa mà còn là kho tàng biểu tượng văn hóa phong phú, đặc biệt là nguồn cảm hứng lớn cho việc tái thiết kế hoa văn truyền thống Việt Nam và Trung Hoa.</p>

          <p>Một nghiên cứu gần đây từ tài liệu "Lược Sử Tộc Việt" (2021) đã chỉ ra nhiều điểm tương đồng thú vị giữa hai nền thần thoại. Cả hai đều sử dụng các mô típ quen thuộc như quả trứng khởi thủy (bọc trăm trứng của Lạc Long Quân - Âu Cơ bên Việt Nam và ông Bàn Cổ sinh từ quả trứng vũ trụ bên Trung Hoa), nạn hồng thủy, cột chống trời, hay hôn nhân cận huyết để giải thích nguồn gốc vũ trụ và loài người. Nhân vật thần thường mang tầm vóc khổng lồ, chức năng khai sáng trời đất, trị thủy, sáng tạo văn hóa và luôn gắn liền khát vọng chinh phục tự nhiên.</p>

          <p>Tuy nhiên, hai nền thần thoại cũng có những nét riêng rõ rệt. Thần thoại Việt Nam khắc họa nhân vật gần gũi, mang dáng dấp con người đời thường (thần Núi như ông lão tóc bạc, thần Lúa như cô gái ẻo lả), đồng thời nhấn mạnh tinh thần tiêu diệt quái vật và thờ vật tổ rồng - chim. Trong khi đó, thần thoại Trung Hoa thiên về hình tượng bán thần (đầu người mình rắn/thú), xuất hiện nhiều hung thần gây hại và các cuộc chiến lớn giữa các vị thần, phản ánh xã hội có trật tự nghiêm ngặt từ thuở sơ khai.</p>

          <p>Những biểu tượng từ thần thoại – rồng, phượng, rùa, mây, núi, sóng nước – chính là nền tảng của rất nhiều hoa văn truyền thống Đông Á. Việc hiểu rõ sự tương đồng và khác biệt này không chỉ giúp tôn vinh giá trị văn hóa mà còn mở ra hướng sáng tạo mới khi làm mới lại các họa tiết cổ, giữ được hồn cốt mà vẫn hiện đại, phù hợp với thẩm mỹ đương đại.</p>

          <p>Nếu bạn đang tìm kiếm cảm hứng để tái thiết kế hoa văn áo dài, nội thất hay đồ họa, thần thoại Việt - Trung chính là "mỏ vàng" không bao giờ cạn. Hãy để những câu chuyện cổ xưa tiếp tục sống động qua từng đường nét thiết kế hôm nay!</p>
        `,
        imageUrl: '/assets/images/tintuc01.png',
        date: new Date('2024-01-15'),
        category: 'Văn hóa',
        
        author: 'Nhớ như in',
        tags: ['Thần thoại', 'Văn hóa Việt Nam', 'Văn hóa Trung Hoa', 'Hoa văn truyền thống']
      },
      {
        id: 'nghien-cuu-ngon-ngu-hoc-ve-nguon-goc-tieng-viet',
        title: 'Nghiên cứu ngôn ngữ học về nguồn gốc tiếng Việt',
        excerpt:
          'Một nghiên cứu ngôn ngữ học lịch sử chi tiết đã khẳng định tiếng Việt thuộc tiểu nhánh Vietic (Việt-Mường) trong hệ ngôn ngữ Nam Á (Austroasiatic), cụ thể là nhánh Môn-Khmer, với nguồn gốc chung từ vùng trung lưu sông Dương Tử – khu vực từng là địa bàn của cộng đồng tộc Việt cổ.',
        content: `
          <p>Một nghiên cứu ngôn ngữ học lịch sử chi tiết đã khẳng định tiếng Việt thuộc tiểu nhánh Vietic (Việt-Mường) trong hệ ngôn ngữ Nam Á (Austroasiatic), cụ thể là nhánh Môn-Khmer, với nguồn gốc chung từ vùng trung lưu sông Dương Tử – khu vực từng là địa bàn của cộng đồng tộc Việt cổ.</p>

          <p>Theo phân tích dựa trên phương pháp so sánh lịch sử chuẩn mực, tiếng Việt chia sẻ kho từ vựng cơ bản (các từ chỉ bộ phận cơ thể, hiện tượng tự nhiên, số đếm, động từ cơ bản…) và các mô hình tương ứng âm vị đều đặn với hơn 160 ngôn ngữ Môn-Khmer trải rộng khắp Đông Nam Á lục địa. Đây chính là bằng chứng mạnh mẽ nhất để xếp tiếng Việt vào hệ Nam Á, thay vì coi nó là nhánh con của bất kỳ ngôn ngữ nào khác.</p>

          <p>Nghiên cứu cũng bác bỏ các giả thuyết đối lập:</p>

          <p><strong>Không phải nguồn gốc Hán:</strong> Dù chịu ảnh hưởng sâu từ tầng từ vựng Hán-Việt, tiếng Việt thiếu từ vựng cơ bản chung với hệ Hán-Tạng và có trật tự từ ngược lại (danh từ trước bổ ngữ).</p>

          <p><strong>Không phải Tai-Kadai:</strong> Chỉ có một số từ vay mượn liên quan đến nông nghiệp, không đủ để chứng minh nguồn gốc chung.</p>

          <p><strong>Không phải Nam Đảo (Austronesian):</strong> Thiếu từ vựng cơ bản và tương ứng âm vị hệ thống; chỉ có vài từ vay mượn từ tiếng Chăm.</p>

          <p>Điểm thú vị là tiếng Việt đã trải qua quá trình tiến hóa đặc biệt: từ ngôn ngữ đa âm tiết, không thanh điệu (giống tổ tiên Môn-Khmer) chuyển sang đơn âm và có thanh điệu – một hiện tượng hiếm gặp trong ngôn ngữ học.</p>

          <p>Kết luận nghiên cứu nhấn mạnh: giả thuyết hệ Nam Á là khả thi nhất, phù hợp với cả bằng chứng ngôn ngữ lẫn dữ liệu di cư cổ đại. Điều này củng cố thêm bản sắc độc lập của tiếng Việt – ngôn ngữ có số người nói lớn nhất trong các ngôn ngữ lục địa Đông Nam Á – đồng thời làm sáng tỏ hành trình lịch sử-văn hóa của dân tộc Việt từ vùng Dương Tử cổ xuống đồng bằng sông Hồng.</p>

          <p>Việc hiểu rõ nguồn gốc ngôn ngữ không chỉ giúp bảo tồn bản sắc mà còn là nguồn cảm hứng sâu sắc để tái thiết kế các họa tiết truyền thống, mang hồn cốt Việt cổ vào những đường nét hiện đại hôm nay.</p>
        `,
        imageUrl: '/assets/images/tintuc02.png',
        date: new Date('2024-08-02'),
        category: 'Ngôn ngữ',
        
        author: 'Nhớ như in',
        tags: ['Ngôn ngữ học', 'Tiếng Việt', 'Nguồn gốc', 'Văn hóa']
      },
      {
        id: 'lich-su-trang-phuc-thoi-hung-vuong',
        title: 'Lịch sử trang phục thời Hùng Vương',
        excerpt:
          'Nghiên cứu mới về trang phục thời Hùng Vương đã bác bỏ hoàn toàn hình ảnh quen thuộc “cởi trần đóng khố, sống nguyên thủy” từng ăn sâu trong tiềm thức người Việt, đồng thời chứng minh người Việt cổ đã sở hữu hệ thống trang phục đa dạng, tinh xảo và phân hóa rõ rệt theo giới tính, tầng lớp xã hội và mục đích sử dụng.',
        content: `
          <p>Nghiên cứu mới về trang phục thời Hùng Vương đã bác bỏ hoàn toàn hình ảnh quen thuộc “cởi trần đóng khố, sống nguyên thủy” từng ăn sâu trong tiềm thức người Việt, đồng thời chứng minh người Việt cổ đã sở hữu hệ thống trang phục đa dạng, tinh xảo và phân hóa rõ rệt theo giới tính, tầng lớp xã hội và mục đích sử dụng.</p>

          <p>Dựa trên cổ vật văn hóa Đông Sơn, văn hóa Thạch Gia Hà (tổ tiên trực tiếp ở vùng trung lưu Dương Tử), cổ vật Điền Việt và tư liệu dân tộc học từ các dân tộc có nguồn gốc chung tộc Việt (Dao, Thái, Choang, Bố Y, Pa Dí, Lê…), các nhà nghiên cứu khẳng định:</p>

          <p><strong>Nam giới:</strong> Áo vạt trái (giao lĩnh hoặc chui đầu), áo hai tà dùng trong lễ tế, áo choàng lông chim/lông ngỗng biểu thị quyền lực.</p>

          <p><strong>Nữ giới:</strong> Váy quấn, váy xếp ly, áo hai tà phối váy, cạp váy và xế trang trí phía trước.</p>

          <p><strong>Giáp chiến:</strong> Giáp lamellar (tấm đồng) và các loại giáp da, vải, tre.</p>

          <p><strong>Mũ miện & khăn:</strong> Mũ lông chim, khăn lươn, khăn mỏ quạ, khăn vấn, nón chóp, nón dẹt, nón tam giác, nón hình thang, mũ tròn; tầng lớp cao nhất đội vương miện hình mào chim hoặc vuông đỉnh nhọn kế thừa từ Thạch Gia Hà.</p>

          <p><strong>Kiểu tóc:</strong> Nam búi tóc, cắt ngắn, tết đuôi sam; nữ búi cao, thả tóc xoăn đuôi, quấn quanh đầu. Đặc trưng chung: cả nam và nữ đều đeo khuyên tai tròn.</p>

          <p>Những hiểu lầm trước đây về “khố” thực chất xuất phát từ việc nhận diện sai áo hai tà trên trống đồng Đông Sơn. Khi đối chiếu với cổ vật Điền Việt và trang phục còn lưu giữ ở các dân tộc nguồn gốc tộc Việt, bức tranh trang phục thời Hùng Vương hiện lên rõ ràng: văn minh, đa dạng và mang bản sắc riêng.</p>

          <p>Nghiên cứu này không chỉ khôi phục lại hình ảnh chính xác về tổ tiên mà còn mở ra nguồn cảm hứng phong phú để tái thiết kế hoa văn truyền thống: họa tiết lông chim, vạt áo giao lĩnh, váy xếp ly, mũ miện Thạch Gia Hà… đều có thể được làm mới, vừa giữ hồn cốt Việt cổ vừa phù hợp thẩm mỹ đương đại.</p>

          <p>Hãy để những đường nét trang phục Hùng Vương thời kỳ rực rỡ nhất tiếp tục sống động trong thiết kế áo dài, nội thất và đồ họa hôm nay!</p>
        `,
        imageUrl: '/assets/images/tintuc03.png',
        date: new Date('2021-11-08'),
        category: 'Lịch sử',
        
        author: 'Nhớ như in',
        tags: ['Hùng Vương', 'Trang phục Việt cổ', 'Đông Sơn', 'Văn hóa']
      },
      {
        id: 'tim-hieu-ve-nguon-goc-cua-toc-nguoi-hoa-ha',
        title: 'Tìm hiểu về nguồn gốc của tộc người Hoa Hạ',
        excerpt:
          'Các nghiên cứu di truyền và khảo cổ hiện đại đã làm sáng tỏ nguồn gốc tộc người Hoa Hạ (tổ tiên chính của người Hán phía Bắc), chứng minh họ chủ yếu hình thành từ nhóm người Khương – các tộc du mục ở thượng nguồn sông Hoàng Hà – di cư vào đồng bằng Hoàng Hà khoảng 5000-6000 năm trước.',
        content: `
          <p>Các nghiên cứu di truyền và khảo cổ hiện đại đã làm sáng tỏ nguồn gốc tộc người Hoa Hạ (tổ tiên chính của người Hán phía Bắc), chứng minh họ chủ yếu hình thành từ nhóm người Khương – các tộc du mục ở thượng nguồn sông Hoàng Hà – di cư vào đồng bằng Hoàng Hà khoảng 5000-6000 năm trước.</p>

          <p>Theo tổng hợp từ nhiều công trình khoa học quốc tế và Trung Quốc (Charleston 2018, Su 2000, Zhao 2010, Wang 2014 &amp; 2021, Liu 2021, Chen 2019…):</p>

          <p>Tổ tiên Hoa Hạ mang haplogroup O3a1c-002611, di cư từ vùng Tây Bắc, hòa nhập với cư dân bản địa cổ Đông Á (văn hóa Ngưỡng Thiều) và tiếp nhận thêm dòng gen từ Bắc Á (Yakut, Siberia) cùng cư dân văn hóa Hạ Xiajiadian (vùng Tây Liêu).</p>

          <p>Sự thay đổi di truyền rõ rệt bắt đầu từ thời văn hóa Long Sơn (khoảng 5000 năm trước), ổn định từ thời nhà Chu. Người Hán phía Bắc hiện đại kế thừa trực tiếp di truyền từ mẫu cổ đại thời Thương-Chu (Hengbei, ~3000 năm trước).</p>

          <p>Kỹ thuật luyện đồng (đồng asen) và chiến xa của Hoa Hạ có nguồn gốc từ Tây Á/Trung Á, du nhập qua các tuyến giao thương phía Bắc và Tây, khác biệt hoàn toàn với kỹ thuật luyện đồng độc lập phát triển sớm hơn ở cộng đồng tộc Việt (văn hóa Khuất Gia Lĩnh → Thạch Gia Hà).</p>

          <p>Nghiên cứu khẳng định tộc Việt và tộc Hoa Hạ phát triển song song, độc lập: tộc Việt hình thành và đạt đỉnh cao ở vùng trung lưu Dương Tử (Lương Chử → Thạch Gia Hà → Phùng Nguyên → Đông Sơn), trong khi Hoa Hạ hình thành muộn hơn ở đồng bằng Hoàng Hà từ dòng di cư du mục Khương.</p>

          <p>Kết quả này bác bỏ các giả thuyết thiếu cơ sở cho rằng Hoa Hạ “chiếm đoạt” di sản Việt cổ, đồng thời làm rõ tiến trình lịch sử riêng biệt của hai dân tộc. Việc hiểu đúng nguồn gốc Hoa Hạ giúp người Việt nhận diện rõ hơn hành trình văn minh độc lập của tổ tiên mình – từ Dương Tử cổ đại đến Văn Lang – Đông Sơn rực rỡ.</p>

          <p>Những hiểu biết khoa học này cũng là nguồn cảm hứng quý giá để tái thiết kế hoa văn truyền thống: họa tiết rồng Việt, trống đồng, mũ lông chim… đều mang hồn cốt riêng, không phụ thuộc, sẵn sàng được làm mới để tỏa sáng trong thiết kế hiện đại hôm nay.</p>
        `,
        imageUrl: '/assets/images/tintuc04.png',
        date: new Date('2021-11-23'),
        category: 'Lịch sử',
        
        author: 'Nhớ như in',
        tags: ['Hoa Hạ', 'Di truyền học', 'Khảo cổ', 'Văn hóa']
      },
      {
        id: 'di-tim-mot-nua-tien-rong-nguon-goc-chim-tien',
        title: 'Đi tìm một nửa Tiên Rồng: nguồn gốc chim Tiên',
        excerpt:
          'Nghiên cứu mới khẳng định “chim Lạc” quen thuộc trên trống đồng Đông Sơn chính là hình tượng chim Tiên (Phượng Hoàng) – một nửa vật tổ lưỡng hợp Tiên-Rồng của người Việt, có nguồn gốc sâu xa từ văn hóa Đông Á cổ đại vùng trung lưu Dương Tử.',
        content: `
          <p>Nghiên cứu mới khẳng định “chim Lạc” quen thuộc trên trống đồng Đông Sơn chính là hình tượng chim Tiên (Phượng Hoàng) – một nửa vật tổ lưỡng hợp Tiên-Rồng của người Việt, có nguồn gốc sâu xa từ văn hóa Đông Á cổ đại vùng trung lưu Dương Tử.</p>

          <p>Dựa trên cổ vật khảo cổ và nghiên cứu di truyền:</p>

          <p>Chim Tiên xuất hiện sớm nhất từ 7400 năm trước ở văn hóa Cao Miếu (Hồ Nam), sau đó lan tỏa qua Hà Mẫu Độ, Hồng Sơn (khoảng 7000 năm trước) – các nền văn hóa tiền thân cộng đồng tộc Việt.</p>

          <p>Khi tộc Việt hình thành ở vùng Dương Tử (Lương Chử → Thạch Gia Hà), chim Tiên kết hợp với Rồng thành biểu tượng thống nhất dân tộc, đại diện cho cái đẹp, cao quý và sứ giả dẫn linh hồn lên trời.</p>

          <p>Di cư về miền Bắc Việt Nam khoảng 4000 năm trước, người Việt tiếp tục kế thừa và biến đổi chim Tiên thành dạng thân dài, mỏ dài, mào đặc trưng – chính là “chim Lạc” trên trống đồng Đông Sơn. Hình tượng này xuất hiện dày đặc, thường bay quanh Mặt Trời hoặc chầu đầu thuyền Rồng, khẳng định vị trí vật tổ thiêng liêng.</p>

          <p>“Chim Lạc” không phải loài chim thực tế ngẫu nhiên, mà là chim Tiên được nghệ thuật hóa theo nguyên mẫu chim Trĩ (giai đoạn đầu) và chim Hồng Hoàng (giai đoạn đồ đồng). Sự biến đổi tương tự cũng thấy ở văn hóa Sở và Tây Hán, nhưng chim Tiên Việt giữ bản sắc riêng, độc lập với Phượng Hoàng Hoa Hạ.</p>

          <p>Hình tượng chim Tiên – cùng Rồng – là biểu tượng cốt lõi của bản sắc Việt, khẳng định “con Rồng cháu Tiên” là ký ức văn hóa liên tục hàng nghìn năm. Đây cũng là nguồn cảm hứng bất tận cho họa tiết truyền thống: mào chim uy nghi, thân dài bay lượn, đôi cánh cách điệu… hoàn toàn có thể được làm mới, kết hợp hiện đại mà vẫn giữ hồn cốt Tiên-Rồng thiêng liêng.</p>

          <p>Hãy để chim Tiên tiếp tục cất cánh trong những đường nét hoa văn áo dài, nội thất và đồ họa hôm nay!</p>
        `,
        imageUrl: '/assets/images/tintuc05.png',
        date: new Date('2021-05-28'),
        category: 'Lịch sử',
        
        author: 'Nhớ như in',
        tags: ['Chim Tiên', 'Chim Lạc', 'Đông Sơn', 'Tiên Rồng']
      },
      {
        id: 'phong-tuc-di-chan-tran-cua-nguoi-viet',
        title: 'Phong tục đi chân trần của người Việt',
        excerpt:
          'Phong tục đi chân trần – một nét văn hóa đặc trưng của người Việt từ thời Hùng Vương đến tận thời trung đại – không xuất phát từ nghèo đói mà mang ý nghĩa triết lý sâu sắc về cân bằng âm dương và sức khỏe, được các nghiên cứu khoa học hiện đại chứng minh giá trị.',
        content: `
          <p>Phong tục đi chân trần – một nét văn hóa đặc trưng của người Việt từ thời Hùng Vương đến tận thời trung đại – không xuất phát từ nghèo đói mà mang ý nghĩa triết lý sâu sắc về cân bằng âm dương và sức khỏe, được các nghiên cứu khoa học hiện đại chứng minh giá trị.</p>

          <p>Các tài liệu lịch sử Trung Hoa và Việt Nam ghi chép rõ ràng:</p>

          <p><strong>Thời cổ đại:</strong> Tam Quốc Chí (thế kỷ III) và Lĩnh Nam chích quái mô tả người Việt “chân trần” như phong tục chung của cộng đồng tộc Việt (Âu Việt, Điền Việt, Chu Nhai – Hải Nam).</p>

          <p><strong>Thời trung đại:</strong> Từ nhà Lý-Trần (Lĩnh Ngoại Đại Đáp, Chư Phiên Chí) đến nhà Nguyễn (Gia Định thành thông chí), cả quý tộc lẫn thường dân đều đi chân đất, ngay cả trong các triều đại thịnh vượng nhất.</p>

          <p>Đây không chỉ là thói quen khí hậu mà còn là cách kết nối trực tiếp với đất trời, điều hòa âm dương qua các huyệt đạo ở bàn chân – triết lý bắt nguồn từ văn hóa tộc Việt vùng Dương Tử cổ (hình âm dương sớm nhất ở Khuất Gia Lĩnh và Thạch Gia Hà).</p>

          <p>Khoa học hiện đại xác nhận:</p>

          <p>Đi chân trần giúp bàn chân khỏe mạnh, dáng đi tự nhiên, giảm lực va chạm và nguy cơ thoái hóa khớp (nghiên cứu Shakoor &amp; Block 2006, 2007).</p>

          <p>Trẻ em đi chân trần thường ít dị tật bàn chân, linh hoạt hơn.</p>

          <p>Phong tục này cũng xuất hiện ở nhiều nền văn minh lớn (Ai Cập, Hy Lạp cổ đại) và vẫn tồn tại ở Úc, New Zealand ngày nay – chứng tỏ giá trị vượt thời gian.</p>

          <p>Phong tục đi chân trần phản ánh triết lý sống gần gũi thiên nhiên của người Việt cổ, là nguồn cảm hứng tuyệt vời để tái thiết kế hoa văn truyền thống: họa tiết bàn chân cách điệu, hình âm dương xoáy tròn, hay các đường nét tự do tượng trưng cho sự kết nối đất trời… đều có thể được làm mới, mang hơi thở hiện đại mà vẫn giữ hồn cốt tổ tiên.</p>

          <p>Hãy để những bước chân trần ngày xưa tiếp tục dẫn lối trong các thiết kế áo dài, nội thất và đồ họa hôm nay!</p>
        `,
        imageUrl: '/assets/images/tintuc06.png',
        date: new Date('2021-10-14'),
        category: 'Văn hóa',
        
        author: 'Nhớ như in',
        tags: ['Chân trần', 'Âm dương', 'Văn hóa Việt', 'Sức khỏe']
      },
      {
        id: 'cau-chuyen-ve-nguon-goc-cua-tet',
        title: 'Câu chuyện về nguồn gốc của Tết',
        excerpt:
          'Tết Nguyên Đán không phải “bản quyền” độc quyền của bất kỳ dân tộc nào, mà là nhu cầu tự nhiên chung của nhân loại – kết thúc năm cũ, chào đón năm mới. Với người Việt, Tết đã tồn tại từ thời Hùng Vương, độc lập và giàu bản sắc, trước khi chịu ảnh hưởng lịch âm và một số phong tục từ Trung Quốc.',
        content: `
          <p>Tết Nguyên Đán không phải “bản quyền” độc quyền của bất kỳ dân tộc nào, mà là nhu cầu tự nhiên chung của nhân loại – kết thúc năm cũ, chào đón năm mới. Với người Việt, Tết đã tồn tại từ thời Hùng Vương, độc lập và giàu bản sắc, trước khi chịu ảnh hưởng lịch âm và một số phong tục từ Trung Quốc.</p>

          <p>Nghiên cứu lịch sử và khảo cổ khẳng định:</p>

          <p>Người Việt cổ có bộ lịch riêng (Quy Lịch từ truyền thuyết Việt Thường dâng rùa thần, lịch Đoi của người Mường dựa trên sao Đoi và Mặt Trăng), ăn Tết có thể vào tháng 10-11 âm lịch.</p>

          <p>Bánh chưng – bánh dày (từ Lang Liêu) là linh hồn Tết Việt, được dâng Tiên Miếu dịp năm hết, với bằng chứng khảo cổ: lúa nếp hạt bầu từ 3500 năm trước và nồi đồng Đông Sơn in dấu lá dong.</p>

          <p>Các dân tộc thiểu số Việt Nam hầu hết có Tết riêng hoặc kết hợp, chứng tỏ truyền thống mừng năm mới là di sản chung, không phụ thuộc lịch Hán.</p>

          <p>Sau thời Bắc thuộc, người Việt tiếp nhận lịch âm (đầu năm tháng 1) và một số phong tục như lì xì, câu đối, đốt pháo – sự giao lưu văn hóa bình thường như Nhật Bản, Triều Tiên. Nhưng cốt lõi Tết Việt vẫn là bánh chưng vuông tròn tượng trời đất, thờ cúng tổ tiên – hồn cốt từ thời Hùng Vương.</p>

          <p>Tết Việt là sự kết tinh độc lập và giao thoa, không cần tranh giành “nguồn gốc”. Đây chính là nguồn cảm hứng bất tận để tái thiết kế hoa văn truyền thống: họa tiết bánh chưng cách điệu, âm dương xoáy tròn, lá dong uốn lượn, hoa mai nở rộ… đều có thể được làm mới, mang hơi thở cổ xưa vào áo dài, nội thất và đồ họa hiện đại hôm nay.</p>

          <p>Hãy để hồn Tết Hùng Vương tiếp tục nở hoa trong những đường nét thiết kế đương đại!</p>
        `,
        imageUrl: '/assets/images/tintuc07.png',
        date: new Date('2024-02-09'),
        category: 'Văn hóa',
        
        author: 'Nhớ như in',
        tags: ['Tết', 'Hùng Vương', 'Bánh chưng', 'Văn hóa Việt']
      }
    ];
  }

  private startAutoSlide() {
    this.stopAutoSlide();

    if (!this.relatedNews.length) return;

    this.sliderIntervalId = window.setInterval(() => {
      this.currentRelatedIndex = (this.currentRelatedIndex + 1) % this.relatedNews.length;
    }, 3500);
  }

  private stopAutoSlide() {
    if (this.sliderIntervalId) {
      window.clearInterval(this.sliderIntervalId);
      this.sliderIntervalId = undefined;
    }
  }

  openDetail(id: string) {
    this.router.navigate(['/tin-tuc', id]);
  }

  getCurrentRelated(): NewsItem | null {
    if (!this.relatedNews.length) return null;
    return this.relatedNews[this.currentRelatedIndex] || null;
  }

  nextRelated() {
    if (!this.relatedNews.length) return;
    this.currentRelatedIndex = (this.currentRelatedIndex + 1) % this.relatedNews.length;
  }

  prevRelated() {
    if (!this.relatedNews.length) return;
    this.currentRelatedIndex = (this.currentRelatedIndex - 1 + this.relatedNews.length) % this.relatedNews.length;
  }

  trackById(_index: number, item: NewsItem) {
    return item.id;
  }

  goBack() {
    this.router.navigate(['/tin-tuc'], {
      state: {
        scrollToTop: true,
        replayAnimations: true
      }
    });
  }
}
