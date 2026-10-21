import type { Comment } from "./types";

const AUTHORS = [
  "Nguyễn Minh Anh",
  "Trần Hoàng Nam",
  "Lê Thu Hà",
  "Phạm Quốc Bảo",
  "Võ Ngọc Mai",
  "Đặng Gia Huy",
  "Bùi Khánh Linh",
  "Đỗ Thành Đạt",
  "Phan Hải Yến",
  "Hoàng Đức Minh",
];

const COMMENTERS = [
  { name: "Nguyễn Lan Anh", body: "Câu chuyện thật ý nghĩa, giúp mình hiểu thêm về lịch sử dân tộc." },
  { name: "Trần Minh Khang", body: "Mình rất khâm phục lòng dũng cảm và tinh thần yêu nước của nhân vật." },
  { name: "Lê Thuỳ Dương", body: "Bài viết dễ đọc và giàu cảm xúc. Cảm ơn bạn đã chia sẻ!" },
  { name: "Phạm Gia Bảo", body: "Đây là một tấm gương đáng nhớ để thế hệ trẻ noi theo." },
  { name: "Võ Ngọc Hà", body: "Đọc xong mình càng thêm tự hào về lịch sử Việt Nam." },
  { name: "Đặng Quốc Khánh", body: "Một câu chuyện rất hay về ý chí và lòng kiên cường." },
  { name: "Bùi Phương Thảo", body: "Mình thích thông điệp về tình yêu quê hương trong bài viết này." },
  { name: "Đỗ Nhật Nam", body: "Mong MiniBlog sẽ chia sẻ thêm nhiều câu chuyện lịch sử như vậy." },
  { name: "Phan Mỹ Linh", body: "Những câu chuyện xưa vẫn đem lại bài học quý giá hôm nay." },
  { name: "Hoàng Tuấn Kiệt", body: "Cảm ơn bài viết đã kể lại một câu chuyện đáng tự hào của dân tộc." },
];

export function getVietnameseAuthor(postId: number): string {
  return AUTHORS[(postId - 1) % AUTHORS.length];
}

export function getVietnameseComment(comment: Comment): { name: string; body: string } {
  return COMMENTERS[(comment.id - 1) % COMMENTERS.length];
}
